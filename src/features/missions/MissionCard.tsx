import { useState } from 'react'
import { useMissionStore } from '@/stores/missionStore'
import { DomainBadge } from '@/components/ui'
import { MISSION_TYPE_LABELS } from '@/types'
import type { IMission } from '@/types'
import styles from './missions.module.css'

interface MissionCardProps {
  mission: IMission
}

export function MissionCard({ mission }: MissionCardProps) {
  const completeMission = useMissionStore((s) => s.completeMission)
  const deleteMission   = useMissionStore((s) => s.deleteMission)
  const [xpFloat, setXpFloat] = useState(false)

  function handleComplete() {
    if (mission.isCompleted) return
    setXpFloat(true)
    completeMission(mission.id)
    setTimeout(() => setXpFloat(false), 1200)
  }

  return (
    <div className={`relative card p-4 flex flex-col gap-3 ${mission.isCompleted ? 'opacity-60' : ''}`}>
      {/* XP float animation */}
      {xpFloat && (
        <span className={styles.xpFloat}>
          +{mission.xpGeneral} XP
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-body font-semibold text-ink text-sm leading-snug ${mission.isCompleted ? 'line-through' : ''}`}>
            {mission.title}
          </p>
          {mission.description && (
            <p className="text-ink/50 text-xs mt-0.5 line-clamp-2">{mission.description}</p>
          )}
        </div>

        <button
          onClick={() => deleteMission(mission.id)}
          className="text-ink/20 hover:text-ink/50 transition-colors text-lg leading-none shrink-0"
          aria-label="Remover missão"
        >
          ×
        </button>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <DomainBadge domain={mission.domain} />
        <span className="text-xs text-ink/40 font-body">
          {MISSION_TYPE_LABELS[mission.type]}
        </span>
        <span className="xp-chip ml-auto">+{mission.xpGeneral} XP</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Streak badge */}
        {mission.type === 'daily' && mission.streak > 0 && (
          <span className={`text-xs font-mono text-gold font-bold ${styles.streakFlame}`}>
            🔥 {mission.streak} dias
          </span>
        )}
        {!(mission.type === 'daily' && mission.streak > 0) && <span />}

        {/* Complete button */}
        <button
          onClick={handleComplete}
          disabled={mission.isCompleted}
          className={`
            text-xs font-semibold px-3 py-1.5 rounded-card transition-all duration-150
            ${mission.isCompleted
              ? 'bg-parchment-dark text-ink/30 cursor-default'
              : 'bg-ink text-parchment hover:bg-ink/80 active:scale-95'}
          `}
        >
          {mission.isCompleted ? 'Concluída ✓' : 'Completar'}
        </button>
      </div>
    </div>
  )
}
