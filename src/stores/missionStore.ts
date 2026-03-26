import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IMission, Domain, MissionType } from '@/types'
import { MISSION_XP } from '@/lib/constants'
import { usePlayerStore } from '@/stores/playerStore'
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
  completeMission: (id: string) => void
  deleteMission:   (id: string) => void
  resetDailies:    () => void
  checkDailyReset: () => void   // call on app open
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
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
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

      completeMission: (id) => {
        const { missions } = get()
        const mission = missions.find((m) => m.id === id)
        if (!mission || mission.isCompleted) return

        usePlayerStore.getState().gainXP({
          general:    mission.xpGeneral,
          domain:     mission.xpDomain,
          domainType: mission.domain as Domain,
        })

        const patch = {
          isCompleted: true,
          completedAt: new Date().toISOString(),
          streak:      mission.streak + 1,
        }
        set((s) => ({
          missions: s.missions.map((m) => m.id === id ? { ...m, ...patch } : m),
        }))
        dbUpdateMission(id, patch)
      },

      deleteMission: (id) => {
        set((s) => ({ missions: s.missions.filter((m) => m.id !== id) }))
        dbDeleteMission(id)
      },

      resetDailies: () => {
        const { playerId } = get()
        set((s) => ({
          missions: s.missions.map((m) =>
            m.type === 'daily' ? { ...m, isCompleted: false, completedAt: null } : m
          ),
        }))
        if (playerId) dbResetDailyMissions(playerId)
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
