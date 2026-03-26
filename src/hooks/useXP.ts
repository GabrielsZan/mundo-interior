import { usePlayerStore } from '@/stores/playerStore'
import type { IPlayer } from '@/types'

export interface XPProgress {
  current:   number
  needed:    number
  percent:   number
  level:     number
}

/** Derived XP progress for the current player. */
export function useXP(): XPProgress | null {
  const player: IPlayer | null = usePlayerStore((s) => s.player)
  if (!player) return null

  const percent = Math.min(100, Math.round((player.xpGeneral / player.xpToNextLevel) * 100))
  return {
    current: player.xpGeneral,
    needed:  player.xpToNextLevel,
    percent,
    level:   player.level,
  }
}
