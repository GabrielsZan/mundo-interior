import { useState } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useSkillStore } from '@/stores/skillStore'
import { DOMAIN_LABELS, DOMAIN_COLORS } from '@/types'
import type { Domain } from '@/types'
import { SkillTreeView } from './SkillTreeView'

const DOMAINS: Domain[] = ['mind', 'body', 'soul', 'creation']

export function SkillTreePage() {
  const player = usePlayerStore((s) => s.player)!
  const skills = useSkillStore((s) => s.skills)
  const [activeDomain, setActiveDomain] = useState<Domain>('mind')

  const domainXP      = player.domainXP[activeDomain]
  const domainColor   = DOMAIN_COLORS[activeDomain]
  const totalSkills   = skills.filter((s) => s.domain === activeDomain).length
  const unlockedCount = skills.filter((s) => s.domain === activeDomain && s.isUnlocked).length

  return (
    <div className="min-h-screen bg-parchment pb-24">
      {/* Header */}
      <header className="bg-white border-b border-parchment-dark px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-xl italic font-bold text-ink leading-tight">
            Árvore da Alma
          </h1>
          <p className="text-ink/40 text-xs">Desbloqueie habilidades com XP de domínio</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-5 flex flex-col gap-5">
        {/* Domain tabs */}
        <div className="flex gap-1 bg-parchment-dark rounded-card p-1">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`
                flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all
                ${activeDomain === d
                  ? 'bg-white text-ink shadow-card'
                  : 'text-ink/50 hover:text-ink/80'}
              `}
            >
              {DOMAIN_LABELS[d]}
            </button>
          ))}
        </div>

        {/* Domain XP status */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-ink/40 font-body">XP disponível</span>
            <span className="font-mono font-bold text-lg" style={{ color: domainColor }}>
              {domainXP} XP
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-ink/40 font-body">Desbloqueadas</span>
            <p className="font-mono font-bold text-lg text-ink">
              {unlockedCount}
              <span className="text-ink/30 font-normal text-sm">/{totalSkills}</span>
            </p>
          </div>
        </div>

        {/* Skill tree */}
        <SkillTreeView domain={activeDomain} />
      </main>
    </div>
  )
}
