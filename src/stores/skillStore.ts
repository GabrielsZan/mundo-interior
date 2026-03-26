import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ISkill, Domain } from '@/types'
import { SKILL_SEED } from '@/data/skills'
import { usePlayerStore } from '@/stores/playerStore'
import { dbFetchUnlockedSkills, dbUnlockSkill } from '@/lib/db'

interface SkillState {
  skills: ISkill[]

  // Actions
  initSkills:  () => void
  unlockSkill: (id: string) => void
  canUnlock:   (id: string) => boolean
  loadFromDb:  (playerId: string) => Promise<void>
}

export const useSkillStore = create<SkillState>()(
  persist(
    (set, get) => ({
      skills: SKILL_SEED,

      initSkills: () => {
        // Merge seed with any already-persisted state (keep isUnlocked flags)
        const { skills } = get()
        const unlockedIds = new Set(skills.filter((s) => s.isUnlocked).map((s) => s.id))
        set({
          skills: SKILL_SEED.map((s) => ({ ...s, isUnlocked: unlockedIds.has(s.id) })),
        })
      },

      canUnlock: (id) => {
        const { skills } = get()
        const skill = skills.find((s) => s.id === id)
        if (!skill || skill.isUnlocked) return false
        const player = usePlayerStore.getState().player
        if (!player) return false
        const hasXP      = player.domainXP[skill.domain as Domain] >= skill.xpCost
        const prereqsMet = skill.prerequisiteIds.every(
          (pid) => skills.find((s) => s.id === pid)?.isUnlocked ?? false
        )
        return hasXP && prereqsMet
      },

      unlockSkill: (id) => {
        const { skills, canUnlock } = get()
        if (!canUnlock(id)) return
        const skill = skills.find((s) => s.id === id)!

        // Spend domain XP
        usePlayerStore.getState().spendDomainXP(skill.domain as Domain, skill.xpCost)

        // Mark as unlocked
        set({ skills: skills.map((s) => (s.id === id ? { ...s, isUnlocked: true } : s)) })

        // Sync to Supabase
        const playerId = usePlayerStore.getState().player?.id
        if (playerId) dbUnlockSkill(playerId, id)
      },

      loadFromDb: async (playerId) => {
        const unlockedIds = new Set(await dbFetchUnlockedSkills(playerId))
        set({
          skills: SKILL_SEED.map((s) => ({ ...s, isUnlocked: unlockedIds.has(s.id) })),
        })
      },
    }),
    { name: 'mundo-interior-skills' }
  )
)
