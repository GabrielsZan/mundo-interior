import { useSkillStore } from '@/stores/skillStore'
import { SkillNode } from './SkillNode'
import type { Domain, SkillTier } from '@/types'

interface SkillTreeViewProps {
  domain: Domain
}

const TIER_LABELS: Record<SkillTier, string> = {
  1: 'Iniciante',
  2: 'Intermediário',
  3: 'Avançado',
}

const TIERS: SkillTier[] = [1, 2, 3]

export function SkillTreeView({ domain }: SkillTreeViewProps) {
  const skills = useSkillStore((s) => s.skills)
  const domainSkills = skills.filter((s) => s.domain === domain)

  return (
    <div className="flex flex-col gap-6">
      {TIERS.map((tier) => {
        const tierSkills = domainSkills.filter((s) => s.tier === tier)
        const unlockedCount = tierSkills.filter((s) => s.isUnlocked).length

        return (
          <section key={tier}>
            {/* Tier header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-heading text-sm italic font-semibold text-ink">
                {TIER_LABELS[tier]}
              </span>
              <span className="text-xs font-mono text-ink/30">
                {unlockedCount}/{tierSkills.length}
              </span>
              <div className="flex-1 h-px bg-parchment-dark" />
              <span className="text-xs text-ink/30 font-mono">{tierSkills[0]?.xpCost} XP</span>
            </div>

            {/* Horizontal scroll row */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory">
              {tierSkills.map((skill) => (
                <div key={skill.id} className="snap-start">
                  <SkillNode skill={skill} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
