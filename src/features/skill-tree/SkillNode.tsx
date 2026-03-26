import { useState } from 'react'
import { useSkillStore } from '@/stores/skillStore'
import { DOMAIN_COLORS } from '@/types'
import type { ISkill } from '@/types'
import styles from '@/styles/animations.module.css'

interface SkillNodeProps {
  skill: ISkill
}

export function SkillNode({ skill }: SkillNodeProps) {
  const canUnlock  = useSkillStore((s) => s.canUnlock)
  const unlockSkill = useSkillStore((s) => s.unlockSkill)
  const skills     = useSkillStore((s) => s.skills)

  const [shimmer, setShimmer] = useState(false)

  const available = canUnlock(skill.id)
  const domainColor = DOMAIN_COLORS[skill.domain]

  // State derivations
  const state: 'unlocked' | 'available' | 'locked' = skill.isUnlocked
    ? 'unlocked'
    : available
      ? 'available'
      : 'locked'

  // Prerequisite names for locked hint
  const missingPrereqs = skill.prerequisiteIds
    .map((pid) => skills.find((s) => s.id === pid))
    .filter((s) => s && !s.isUnlocked)
    .map((s) => s!.name)

  function handleUnlock() {
    if (state !== 'available') return
    setShimmer(true)
    unlockSkill(skill.id)
    setTimeout(() => setShimmer(false), 800)
  }

  return (
    <div
      className={`
        relative flex flex-col gap-2 p-3 rounded-card border transition-all duration-200 w-44 shrink-0
        ${state === 'unlocked'
          ? 'bg-white border-transparent shadow-card'
          : state === 'available'
            ? 'bg-white border-2 cursor-pointer hover:shadow-card'
            : 'bg-parchment border-parchment-dark opacity-50'}
        ${shimmer ? styles.skillUnlock : ''}
      `}
      style={state === 'available' ? { borderColor: domainColor } : undefined}
    >
      {/* Tier badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-mono font-bold"
          style={{ color: state === 'locked' ? undefined : domainColor }}
        >
          {skill.isUnlocked ? '✓' : state === 'available' ? `${skill.xpCost} XP` : '🔒'}
        </span>
        <span className="text-[10px] text-ink/30 font-mono uppercase">T{skill.tier}</span>
      </div>

      {/* Name & description */}
      <div>
        <p className={`font-body font-semibold text-sm leading-snug ${state === 'locked' ? 'text-ink/40' : 'text-ink'}`}>
          {skill.name}
        </p>
        <p className="text-ink/40 text-xs mt-0.5 line-clamp-2 leading-snug">
          {skill.description}
        </p>
      </div>

      {/* Prerequisite hint */}
      {state === 'locked' && missingPrereqs.length > 0 && (
        <p className="text-ink/30 text-[10px] leading-snug">
          Requer: {missingPrereqs.join(', ')}
        </p>
      )}

      {/* Unlock button */}
      {state === 'available' && (
        <button
          onClick={handleUnlock}
          className="mt-auto text-xs font-semibold py-1 px-2 rounded-[6px] transition-all active:scale-95"
          style={{ background: domainColor, color: '#fff' }}
        >
          Desbloquear
        </button>
      )}
    </div>
  )
}
