import type { MissionType, SkillTier } from '@/types'

// ── XP Formulas ─────────────────────────────────────────────────────────────

/** XP required to reach the next level from the current one. */
export function xpToNextLevel(currentLevel: number): number {
  return Math.floor(100 * currentLevel * 1.15)
}

// ── Mission XP Rewards ───────────────────────────────────────────────────────

export const MISSION_XP: Record<MissionType, { general: [number, number]; domain: [number, number] }> = {
  daily: {
    general: [50, 50],
    domain:  [50, 50],
  },
  main: {
    general: [100, 200],
    domain:  [100, 200],
  },
  epic: {
    general: [200, 500],
    domain:  [200, 500],
  },
}

// ── Skill XP Costs ───────────────────────────────────────────────────────────

export const SKILL_XP_COST: Record<SkillTier, number> = {
  1: 100,
  2: 150,
  3: 200,
}

// ── Streak ───────────────────────────────────────────────────────────────────

/** Minimum streak milestones for bonus rewards (future feature). */
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const
