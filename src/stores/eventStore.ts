import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentWeekEvent, getWeekKey } from '@/lib/weeklyEvents'
import { usePlayerStore } from '@/stores/playerStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import type { IItem } from '@/types'

interface EventState {
  weekKey:       string   // "2026-W13" — which week we're tracking
  progress:      number   // missions completed this week (any type)
  rewardClaimed: boolean

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

      checkNewWeek: () => {
        const current = getWeekKey()
        if (get().weekKey !== current) {
          set({ weekKey: current, progress: 0, rewardClaimed: false })
        }
      },

      progressEvent: () => {
        get().checkNewWeek()
        set((s) => ({ progress: s.progress + 1 }))
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
        return item
      },
    }),
    { name: 'event-store' }
  )
)
