import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IMission, IItem, Domain, MissionType } from '@/types'
import { MISSION_XP } from '@/lib/constants'
import { rollLoot } from '@/lib/lootTables'
import { usePlayerStore } from '@/stores/playerStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useJournalStore } from '@/stores/journalStore'
import { useEventStore } from '@/stores/eventStore'
import {
  dbFetchMissions,
  dbInsertMission,
  dbUpdateMission,
  dbDeleteMission,
  dbResetDailyMissions,
} from '@/lib/db'

interface MissionState {
  missions:      IMission[]
  playerId:      string | null
  lastResetDate: string | null  // YYYY-MM-DD of last daily reset

  // Actions
  addMission:      (draft: Omit<IMission, 'id' | 'isCompleted' | 'completedAt' | 'streak' | 'createdAt' | 'xpGeneral' | 'xpDomain'>) => void
  addBulkMissions: (drafts: Array<Omit<IMission, 'id' | 'isCompleted' | 'completedAt' | 'streak' | 'createdAt' | 'xpGeneral' | 'xpDomain'>>) => void
  completeMission: (id: string) => IItem[]  // returns dropped items for animation
  deleteMission:   (id: string) => void
  resetDailies:    () => void
  checkDailyReset: () => void
  setPlayerId:     (id: string | null) => void
  loadFromDb:      (playerId: string) => Promise<void>
}

function missionXP(type: MissionType): { xpGeneral: number; xpDomain: number } {
  const { general, domain } = MISSION_XP[type]
  const xpGeneral = Math.round((general[0] + general[1]) / 2)
  const xpDomain  = Math.round((domain[0]  + domain[1])  / 2)
  return { xpGeneral, xpDomain }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions:      [],
      playerId:      null,
      lastResetDate: null,

      addMission: (draft) => {
        const { xpGeneral, xpDomain } = missionXP(draft.type)
        const mission: IMission = {
          ...draft,
          id:          crypto.randomUUID(),
          isCompleted: false,
          completedAt: null,
          streak:      0,
          createdAt:   new Date().toISOString(),
          xpGeneral,
          xpDomain,
        }
        set((s) => ({ missions: [...s.missions, mission] }))
        const { playerId } = get()
        if (playerId) dbInsertMission(mission, playerId)
      },

      addBulkMissions: (drafts) => {
        drafts.forEach((d) => get().addMission(d))
      },

      completeMission: (id) => {
        const { missions } = get()
        const mission = missions.find((m) => m.id === id)
        if (!mission || mission.isCompleted) return []

        // XP
        usePlayerStore.getState().gainXP({
          general:    mission.xpGeneral,
          domain:     mission.xpDomain,
          domainType: mission.domain as Domain,
        })

        // Loot
        const completedAt = new Date().toISOString()
        const lootEntries = rollLoot(mission.domain, mission.type)
        const items: IItem[] = lootEntries.map((entry) => ({
          ...entry,
          id:          crypto.randomUUID(),
          obtainedAt:  completedAt,
          fromMission: mission.title,
        }))
        useInventoryStore.getState().addItems(items)

        // Journal
        useJournalStore.getState().addEntry({
          id:           crypto.randomUUID(),
          missionId:    id,
          missionTitle: mission.title,
          domain:       mission.domain,
          type:         mission.type,
          xpGeneral:    mission.xpGeneral,
          xpDomain:     mission.xpDomain,
          completedAt,
          itemIds:      items.map((i) => i.id),
          note:         '',
        })

        // Weekly event progress
        useEventStore.getState().progressEvent()

        const patch = {
          isCompleted: true,
          completedAt,
          streak:      mission.streak + 1,
        }
        set((s) => ({
          missions: s.missions.map((m) => m.id === id ? { ...m, ...patch } : m),
        }))
        dbUpdateMission(id, patch)

        return items
      },

      deleteMission: (id) => {
        set((s) => ({ missions: s.missions.filter((m) => m.id !== id) }))
        dbDeleteMission(id)
      },

      resetDailies: () => {
        const { missions, playerId } = get()
        // Missions NOT completed yesterday lose their streak
        const missedIds = missions
          .filter((m) => m.type === 'daily' && !m.isCompleted)
          .map((m) => m.id)

        set((s) => ({
          missions: s.missions.map((m) =>
            m.type === 'daily'
              ? { ...m, isCompleted: false, completedAt: null, streak: m.isCompleted ? m.streak : 0 }
              : m
          ),
        }))

        if (playerId) {
          dbResetDailyMissions(playerId)
          missedIds.forEach((id) => dbUpdateMission(id, { streak: 0 }))
        }
      },

      checkDailyReset: () => {
        const today = todayISO()
        if (get().lastResetDate === today) return
        get().resetDailies()
        set({ lastResetDate: today })
      },

      setPlayerId: (id) => set({ playerId: id }),

      loadFromDb: async (playerId) => {
        const missions = await dbFetchMissions(playerId)
        set({ missions, playerId })
      },
    }),
    { name: 'mundo-interior-missions' }
  )
)
