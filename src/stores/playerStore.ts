import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IPlayer, IDomainXP, Domain, IXPGain } from '@/types'
import { xpToNextLevel } from '@/lib/constants'

interface PlayerState {
  player: IPlayer | null
  isLoading: boolean

  // Actions
  initPlayer: (name: string) => void
  gainXP: (gain: IXPGain) => void
  resetPlayer: () => void
}

const DEFAULT_DOMAIN_XP: IDomainXP = {
  mind: 0, body: 0, soul: 0, creation: 0,
}

function createDefaultPlayer(name: string): IPlayer {
  const level = 1
  return {
    id:            crypto.randomUUID(),
    name,
    level,
    xpGeneral:     0,
    xpToNextLevel: xpToNextLevel(level),
    domainXP:      { ...DEFAULT_DOMAIN_XP },
    createdAt:     new Date().toISOString(),
  }
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player:    null,
      isLoading: false,

      initPlayer: (name) => {
        set({ player: createDefaultPlayer(name) })
      },

      gainXP: ({ general, domain, domainType }: IXPGain) => {
        const { player } = get()
        if (!player) return

        const newXPGeneral = player.xpGeneral + general
        const newDomainXP  = {
          ...player.domainXP,
          [domainType as Domain]: (player.domainXP[domainType as Domain] ?? 0) + domain,
        }

        // Level-up loop: a single gain can trigger multiple level-ups
        let level      = player.level
        let xpPool     = newXPGeneral
        let threshold  = xpToNextLevel(level)

        while (xpPool >= threshold) {
          xpPool    -= threshold
          level     += 1
          threshold  = xpToNextLevel(level)
        }

        set({
          player: {
            ...player,
            level,
            xpGeneral:     xpPool,
            xpToNextLevel: threshold,
            domainXP:      newDomainXP,
          },
        })
      },

      resetPlayer: () => set({ player: null }),
    }),
    { name: 'mundo-interior-player' }
  )
)
