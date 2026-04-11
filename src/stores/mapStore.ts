import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ALL_MAP_MISSIONS } from '@/lib/mapMissions'
import type { IMapMission } from '@/lib/mapMissions'
import type { MapDomain } from '@/features/map/mapData'
import type { Domain, IItem } from '@/types'
import { usePlayerStore } from '@/stores/playerStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useJournalStore } from '@/stores/journalStore'
import { useEventStore } from '@/stores/eventStore'
import { rollLoot } from '@/lib/lootTables'
import { computeActiveBuffs, applyXPBuffs } from '@/lib/buffs'
import { useSkillStore } from '@/stores/skillStore'
import { dbFetchMapState, dbUpsertMapState } from '@/lib/db'
import type { MapStateSnapshot } from '@/lib/db'

// ── Progression order per region ─────────────────────────────────────────────
const REGION_ORDER: Record<MapDomain, string[]> = {
  mente:   ['mente-1', 'mente-2', 'mente-3', 'challenge-mente', 'mente-4', 'mente-5'],
  alma:    ['alma-1',  'alma-2',  'alma-3',  'challenge-alma',  'alma-4',  'alma-5'],
  corpo:   ['corpo-1', 'corpo-2', 'corpo-3', 'challenge-corpo', 'corpo-4', 'corpo-5'],
  criacao: ['criacao-1', 'criacao-2', 'criacao-3', 'challenge-criacao', 'criacao-4', 'criacao-5'],
}

// Map from MapDomain → playerStore domainXP key
const DOMAIN_MAP: Record<MapDomain, Domain> = {
  mente:   'mind',
  corpo:   'body',
  alma:    'soul',
  criacao: 'creation',
}

// Nyxos tentações per domain
const NYXOS_TENTACOES: Record<MapDomain, { name: string; frase: string }> = {
  mente:   { name: 'A Paralisia da Análise',  frase: 'Por que agir se você pode planejar mais?' },
  corpo:   { name: 'O Conforto Eterno',       frase: 'Descanse mais, você merece. Amanhã você treina.' },
  alma:    { name: 'O Isolamento Dourado',    frase: 'Você não precisa de ninguém. Fique na sua.' },
  criacao: { name: 'A Perfeição Infinita',    frase: 'Não publique ainda. Não está bom o suficiente.' },
}

// Inactivity thresholds → invasion probability
const INACTIVITY_CHANCES: [number, number][] = [
  [7, 0.80],
  [6, 0.65],
  [5, 0.50],
  [4, 0.35],
  [3, 0.20],
  [0, 0.05],
]

function getInvasionChance(daysInactive: number): number {
  for (const [days, chance] of INACTIVITY_CHANCES) {
    if (daysInactive >= days) return chance
  }
  return 0.05
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function syncMapState(state: MapState): void {
  const playerId = usePlayerStore.getState().player?.id
  if (!playerId) return
  const snapshot: MapStateSnapshot = {
    revealedPois:         state.revealedPois,
    completedPois:        state.completedPois,
    invadedPois:          state.invadedPois,
    completedMapMissions: state.completedMapMissions,
    lastActivityDate:     state.lastActivityDate,
    lastInvasionCheck:    state.lastInvasionCheck,
    daysInactive:         state.daysInactive,
    pendingInvasions:     state.pendingInvasions,
  }
  dbUpsertMapState(playerId, snapshot)
}

export interface PendingInvasion {
  domain:   string
  poiId:    string
  poiName:  string
  tentacao: string
  frase:    string
}

interface MapState {
  // ── Revealed/completed/invaded ────────────────────────────────────────────
  revealedPois:          string[]
  completedPois:         string[]
  invadedPois:           string[]
  completedMapMissions:  string[]

  // ── Activity tracking ─────────────────────────────────────────────────────
  lastActivityDate:  string | null
  lastInvasionCheck: string | null
  daysInactive:      number

  // ── Notifications ─────────────────────────────────────────────────────────
  pendingInvasions: PendingInvasion[]

  // ── Actions ───────────────────────────────────────────────────────────────
  loadFromDb:            (playerId: string) => Promise<void>
  completeMapMission:    (missionId: string, poiId: string) => void
  reconquerPOI:          (poiId: string) => void
  checkInvasion:         () => void
  clearPendingInvasions: () => void

  // ── Selectors ─────────────────────────────────────────────────────────────
  isPOIRevealed:  (poiId: string) => boolean
  isPOICompleted: (poiId: string) => boolean
  isPOIInvaded:   (poiId: string) => boolean
  isPOILocked:    (poiId: string) => boolean
  getMissionsForPOI: (poiId: string) => IMapMission[]
}

// Helper: get the domain of a POI id
function getDomainOfPOI(poiId: string): MapDomain | null {
  for (const [domain, order] of Object.entries(REGION_ORDER) as [MapDomain, string[]][]) {
    if (order.includes(poiId)) return domain
  }
  return null
}

// Helper: get the next POI id in a region after the given poiId
function getNextPOI(poiId: string): string | null {
  for (const order of Object.values(REGION_ORDER)) {
    const idx = order.indexOf(poiId)
    if (idx !== -1 && idx + 1 < order.length) return order[idx + 1]
  }
  return null
}


export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      // Initial state
      revealedPois:         ['citadel', 'mente-1', 'alma-1', 'corpo-1', 'criacao-1'],
      completedPois:        [],
      invadedPois:          [],
      completedMapMissions: [],
      lastActivityDate:     null,
      lastInvasionCheck:    null,
      daysInactive:         0,
      pendingInvasions:     [],

      // ── Actions ────────────────────────────────────────────────────────────

      loadFromDb: async (playerId) => {
        const snapshot = await dbFetchMapState(playerId)
        if (snapshot) set(snapshot)
      },

      completeMapMission: (missionId, poiId) => {
        const state = get()

        // Prevent re-completing
        if (state.completedMapMissions.includes(missionId)) return

        // Don't allow completing missions in invaded POIs
        if (state.invadedPois.includes(poiId)) return

        const newCompleted = [...state.completedMapMissions, missionId]

        // Check if ALL missions for this POI are now done
        const poiMissions = ALL_MAP_MISSIONS.filter((m) => m.poiId === poiId)
        const allDone     = poiMissions.every((m) => newCompleted.includes(m.id))

        let newCompletedPois = [...state.completedPois]
        let newRevealedPois  = [...state.revealedPois]

        if (allDone && !newCompletedPois.includes(poiId)) {
          newCompletedPois = [...newCompletedPois, poiId]

          // Reveal the next POI in progression
          const nextPoi = getNextPOI(poiId)
          if (nextPoi && !newRevealedPois.includes(nextPoi)) {
            newRevealedPois = [...newRevealedPois, nextPoi]
          }
        }

        // Award XP + loot + journal
        const mission = ALL_MAP_MISSIONS.find((m) => m.id === missionId)
        if (mission) {
          const domainKey   = DOMAIN_MAP[mission.domain]
          const completedAt = new Date().toISOString()

          // Buffs
          const activeBuffs = computeActiveBuffs(useSkillStore.getState().skills)
          const boosted = applyXPBuffs(
            { xpGeneral: mission.xpGeneral, xpDomain: mission.xpDomain },
            activeBuffs,
            domainKey,
          )

          usePlayerStore.getState().gainXP({
            general:    boosted.xpGeneral,
            domain:     boosted.xpDomain,
            domainType: domainKey,
          })

          // Loot (com buffs)
          const lootEntries = rollLoot(
            domainKey,
            mission.type,
            activeBuffs.lootRarityShift,
            activeBuffs.lootExtraChance,
          )
          const items: IItem[] = lootEntries.map((entry) => ({
            ...entry,
            id:          crypto.randomUUID(),
            obtainedAt:  completedAt,
            fromMission: mission.name,
          }))
          useInventoryStore.getState().addItems(items)

          // Journal (registra XP real com buffs)
          useJournalStore.getState().addEntry({
            id:           crypto.randomUUID(),
            missionId:    missionId,
            missionTitle: mission.name,
            domain:       domainKey,
            type:         mission.type,
            xpGeneral:    boosted.xpGeneral,
            xpDomain:     boosted.xpDomain,
            completedAt,
            itemIds:      items.map((i) => i.id),
            note:         '',
          })
        }

        // Weekly event progress
        useEventStore.getState().progressEvent()

        set({
          completedMapMissions: newCompleted,
          completedPois:        newCompletedPois,
          revealedPois:         newRevealedPois,
          lastActivityDate:     todayStr(),
          daysInactive:         0,
        })
        syncMapState(get())
      },

      reconquerPOI: (poiId) => {
        const state = get()

        // Remove from invaded
        const newInvaded = state.invadedPois.filter((id) => id !== poiId)

        // Remove the invaded POI from completedPois (it was already there before invasion)
        const newCompletedPois = state.completedPois.filter((id) => id !== poiId)

        // Remove all completed missions for this POI from completedMapMissions
        const poiMissionIds = ALL_MAP_MISSIONS.filter((m) => m.poiId === poiId).map((m) => m.id)
        const newCompletedMissions = state.completedMapMissions.filter(
          (id) => !poiMissionIds.includes(id)
        )

        // Re-reveal subsequent POIs if they were previously revealed because of this POI
        // (they stay revealed — re-locking is already handled by isPOILocked)

        set({
          invadedPois:          newInvaded,
          completedPois:        newCompletedPois,
          completedMapMissions: newCompletedMissions,
          lastActivityDate:     todayStr(),
          daysInactive:         0,
        })
        syncMapState(get())
      },

      checkInvasion: () => {
        const state = get()
        const today = todayStr()

        // Only run once per day
        if (state.lastInvasionCheck === today) return

        // Calculate days inactive
        let daysInactive = state.daysInactive
        if (state.lastActivityDate) {
          const last    = new Date(state.lastActivityDate)
          const now     = new Date(today)
          const diffMs  = now.getTime() - last.getTime()
          daysInactive  = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        }

        const newPendingInvasions: PendingInvasion[] = [...state.pendingInvasions]
        let newInvadedPois = [...state.invadedPois]

        if (daysInactive >= 3) {
          const chance = getInvasionChance(daysInactive)

          const domains: MapDomain[] = ['mente', 'alma', 'corpo', 'criacao']

          for (const domain of domains) {
            // Max 1 invaded POI per domain
            const alreadyInvaded = state.invadedPois.some(
              (id) => getDomainOfPOI(id) === domain
            )
            if (alreadyInvaded) continue

            // Need at least 3 completed POIs in domain
            const regionOrder   = REGION_ORDER[domain]
            const completedInDomain = state.completedPois.filter((id) =>
              regionOrder.includes(id)
            )
            if (completedInDomain.length < 3) continue

            // Roll the dice
            if (Math.random() > chance) continue

            // Pick a random completed POI in this domain
            const idx    = Math.floor(Math.random() * completedInDomain.length)
            const target = completedInDomain[idx]

            newInvadedPois = [...newInvadedPois, target]

            const tentacao = NYXOS_TENTACOES[domain]
            const poiMissions = ALL_MAP_MISSIONS.filter((m) => m.poiId === target)
            void poiMissions  // missions data available if needed later

            newPendingInvasions.push({
              domain,
              poiId:    target,
              poiName:  target,  // MapPage will resolve the actual name
              tentacao: tentacao.name,
              frase:    tentacao.frase,
            })
          }
        }

        set({
          invadedPois:       newInvadedPois,
          pendingInvasions:  newPendingInvasions,
          daysInactive,
          lastInvasionCheck: today,
        })
        syncMapState(get())
      },

      clearPendingInvasions: () => {
        set({ pendingInvasions: [] })
        syncMapState(get())
      },

      // ── Selectors ──────────────────────────────────────────────────────────

      isPOIRevealed: (poiId) => {
        return get().revealedPois.includes(poiId)
      },

      isPOICompleted: (poiId) => {
        return get().completedPois.includes(poiId)
      },

      isPOIInvaded: (poiId) => {
        return get().invadedPois.includes(poiId)
      },

      isPOILocked: (poiId) => {
        // A POI is locked if a preceding POI in its region is currently invaded
        const state = get()
        for (const order of Object.values(REGION_ORDER)) {
          const idx = order.indexOf(poiId)
          if (idx === -1) continue
          // Check all POIs before this one in the region
          for (let i = 0; i < idx; i++) {
            if (state.invadedPois.includes(order[i])) return true
          }
          return false
        }
        return false
      },

      getMissionsForPOI: (poiId) => {
        return ALL_MAP_MISSIONS.filter((m) => m.poiId === poiId)
          .sort((a, b) => a.order - b.order)
      },
    }),
    { name: 'map-store' }
  )
)
