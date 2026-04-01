import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IPlayer, IDomainXP, Domain, IXPGain } from '@/types'
import { xpToNextLevel } from '@/lib/constants'
import { dbFetchPlayer, dbUpsertPlayer } from '@/lib/db'

interface PlayerState {
  player:    IPlayer | null
  userId:    string | null
  isLoading: boolean

  // Actions
  initPlayer:          (name: string, userId?: string) => void
  loadFromDb:          (userId: string) => Promise<'loaded' | 'not_found'>
  gainXP:              (gain: IXPGain) => void
  spendDomainXP:       (domain: Domain, amount: number) => void
  resetPlayer:         () => void
  completeOnboarding:  () => void
}

const DEFAULT_DOMAIN_XP: IDomainXP = {
  mind: 0, body: 0, soul: 0, creation: 0,
}

function createDefaultPlayer(name: string): IPlayer {
  const level = 1
  return {
    id:                     crypto.randomUUID(),
    name,
    level,
    xpGeneral:              0,
    xpToNextLevel:          xpToNextLevel(level),
    domainXP:               { ...DEFAULT_DOMAIN_XP },
    createdAt:              new Date().toISOString(),
    hasCompletedOnboarding: false,
  }
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player:    null,
      userId:    null,
      isLoading: false,

      initPlayer: (name, userId) => {
        const uid    = userId ?? get().userId ?? undefined
        const player = createDefaultPlayer(name)
        set({ player, userId: uid ?? null })
        if (uid) dbUpsertPlayer(player, uid)
      },

      loadFromDb: async (userId) => {
        set({ isLoading: true, userId })
        const dbPlayer = await dbFetchPlayer(userId)
        if (dbPlayer) {
          set({ player: dbPlayer, isLoading: false })
          return 'loaded'
        }
        // Offline fallback: use persisted local state if present
        const local = get().player
        set({ isLoading: false })
        return local ? 'loaded' : 'not_found'
      },

      gainXP: ({ general, domain, domainType }: IXPGain) => {
        const { player, userId } = get()
        if (!player) return

        const newDomainXP = {
          ...player.domainXP,
          [domainType as Domain]: (player.domainXP[domainType as Domain] ?? 0) + domain,
        }

        let level     = player.level
        let xpPool    = player.xpGeneral + general
        let threshold = xpToNextLevel(level)

        while (xpPool >= threshold) {
          xpPool    -= threshold
          level     += 1
          threshold  = xpToNextLevel(level)
        }

        const updated: IPlayer = {
          ...player,
          level,
          xpGeneral:     xpPool,
          xpToNextLevel: threshold,
          domainXP:      newDomainXP,
        }
        set({ player: updated })
        if (userId) dbUpsertPlayer(updated, userId)
      },

      spendDomainXP: (domain, amount) => {
        const { player, userId } = get()
        if (!player || player.domainXP[domain] < amount) return
        const updated: IPlayer = {
          ...player,
          domainXP: { ...player.domainXP, [domain]: player.domainXP[domain] - amount },
        }
        set({ player: updated })
        if (userId) dbUpsertPlayer(updated, userId)
      },

      resetPlayer: () => set({ player: null, userId: null }),

      completeOnboarding: () => {
        const { player, userId } = get()
        if (!player) return
        const updated: IPlayer = { ...player, hasCompletedOnboarding: true }
        set({ player: updated })
        if (userId) dbUpsertPlayer(updated, userId)
      },
    }),
    { name: 'mundo-interior-player' }
  )
)
