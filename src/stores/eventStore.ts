import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentWeekEvent, getWeekKey } from '@/lib/weeklyEvents'
import { usePlayerStore } from '@/stores/playerStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { dbFetchEventState, dbUpsertEventState } from '@/lib/db'
import type { IItem } from '@/types'

interface EventState {
  weekKey:       string   // "2026-W13" — which week we're tracking
  progress:      number   // missions completed this week (any type)
  rewardClaimed: boolean

  loadFromDb:     (playerId: string) => Promise<void>
  checkNewWeek:   () => void
  progressEvent:  () => void
  claimReward:    () => IItem | null
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      weekKey:       getWeekKey(),
      progress:      0,
      rewardClaimed: false,

      loadFromDb: async (playerId) => {
        const snapshot = await dbFetchEventState(playerId)
        if (snapshot) set(snapshot)
      },

      checkNewWeek: () => {
        const current = getWeekKey()
        if (get().weekKey !== current) {
          set({ weekKey: current, progress: 0, rewardClaimed: false })
          const playerId = usePlayerStore.getState().player?.id
          if (playerId) dbUpsertEventState(playerId, { weekKey: current, progress: 0, rewardClaimed: false })
        }
      },

      progressEvent: () => {
        get().checkNewWeek()
        set((s) => ({ progress: s.progress + 1 }))
        const { weekKey, progress, rewardClaimed } = get()
        const playerId = usePlayerStore.getState().player?.id
        if (playerId) dbUpsertEventState(playerId, { weekKey, progress, rewardClaimed })
      },

      claimReward: () => {
        const state = get()
        state.checkNewWeek()
        const event = getCurrentWeekEvent()

        if (state.rewardClaimed || state.progress < event.requirement) return null

        // Award XP
        usePlayerStore.getState().gainXP({
          general:    event.xpBonus,
          domain:     0,
          domainType: 'mind',
        })

        // Award item
        const item: IItem = {
          id:          crypto.randomUUID(),
          name:        event.rewardName,
          description: event.rewardDesc,
          domain:      event.domain === 'todas' ? 'mind' : (
            event.domain === 'mente'   ? 'mind'     :
            event.domain === 'corpo'   ? 'body'     :
            event.domain === 'alma'    ? 'soul'     : 'creation'
          ),
          rarity:      'rare',
          icon:        event.rewardIcon,
          obtainedAt:  new Date().toISOString(),
          fromMission: event.name,
        }
        useInventoryStore.getState().addItems([item])

        set({ rewardClaimed: true })
        const { weekKey, progress } = get()
        const playerId = usePlayerStore.getState().player?.id
        if (playerId) dbUpsertEventState(playerId, { weekKey, progress, rewardClaimed: true })
        return item
      },
    }),
    { name: 'event-store' }
  )
)
