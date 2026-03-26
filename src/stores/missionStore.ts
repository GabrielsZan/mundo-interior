import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IMission, Domain, MissionType } from '@/types'
import { MISSION_XP } from '@/lib/constants'
import { usePlayerStore } from '@/stores/playerStore'

interface MissionState {
  missions: IMission[]

  // Actions
  addMission:     (draft: Omit<IMission, 'id' | 'isCompleted' | 'completedAt' | 'streak' | 'createdAt' | 'xpGeneral' | 'xpDomain'>) => void
  completeMission:(id: string) => void
  deleteMission:  (id: string) => void
  resetDailies:   () => void  // called at midnight
}

function missionXP(type: MissionType): { xpGeneral: number; xpDomain: number } {
  const { general, domain } = MISSION_XP[type]
  // Use midpoint of range for deterministic value; can randomise later
  const xpGeneral = Math.round((general[0] + general[1]) / 2)
  const xpDomain  = Math.round((domain[0]  + domain[1])  / 2)
  return { xpGeneral, xpDomain }
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions: [],

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
      },

      completeMission: (id) => {
        const { missions } = get()
        const mission = missions.find((m) => m.id === id)
        if (!mission || mission.isCompleted) return

        // Award XP to the player
        usePlayerStore.getState().gainXP({
          general:    mission.xpGeneral,
          domain:     mission.xpDomain,
          domainType: mission.domain as Domain,
        })

        set((s) => ({
          missions: s.missions.map((m) =>
            m.id === id
              ? { ...m, isCompleted: true, completedAt: new Date().toISOString(), streak: m.streak + 1 }
              : m
          ),
        }))
      },

      deleteMission: (id) =>
        set((s) => ({ missions: s.missions.filter((m) => m.id !== id) })),

      resetDailies: () =>
        set((s) => ({
          missions: s.missions.map((m) =>
            m.type === 'daily'
              ? { ...m, isCompleted: false, completedAt: null }
              : m
          ),
        })),
    }),
    { name: 'mundo-interior-missions' }
  )
)
