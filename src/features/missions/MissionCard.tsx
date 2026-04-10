import { useState } from 'react'
import { useMissionStore } from '@/stores/missionStore'
import { DomainBadge } from '@/components/ui'
import { MISSION_TYPE_LABELS } from '@/types'
import type { IMission, IItem } from '@/types'
import styles from './missions.module.css'

interface MissionCardProps {
  mission: IMission
}

export function MissionCard({ mission }: MissionCardProps) {
  const completeMission = useMissionStore((s) => s.completeMission)
  const deleteMission   = useMissionStore((s) => s.deleteMission)
  const [xpFloat,        setXpFloat]        = useState(false)
  const [lootItems,      setLootItems]      = useState<IItem[]>([])
  const [confirmDelete,  setConfirmDelete]  = useState(false)

  function handleComplete() {
    if (mission.isCompleted) return
    setXpFloat(true)
    const items = completeMission(mission.id)
    setLootItems(items)
    setTimeout(() => setXpFloat(false), 1200)
    setTimeout(() => setLootItems([]), 2200)
  }

  return (
    <div className={`relative card p-4 flex flex-col gap-3 ${mission.isCompleted ? 'opacity-60' : ''}`}>
      {/* XP float animation */}
      {xpFloat && (
        <span className={styles.xpFloat}>
          +{mission.xpGeneral} XP
        </span>
      )}

      {/* Loot pop animations */}
      {lootItems.map((item, i) => (
        <span
          key={item.id}
          className={styles.lootItem}
          style={{ right: 8 + i * 32 }}
        >
          {item.icon}
        </span>
      ))}

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

        {confirmDelete ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[11px] text-ink/40 hover:text-ink/60 px-1.5 py-0.5 rounded transition-colors"
            >
              Não
            </button>
            <button
              onClick={() => deleteMission(mission.id)}
              className="text-[11px] text-red-500 font-semibold px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
            >
              Sim
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-ink/20 hover:text-ink/50 transition-colors text-lg leading-none shrink-0"
            aria-label="Remover missão"
          >
            ×
          </button>
        )}
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
        {mission.type === 'daily' && mission.streak > 0 && (
          <span className={`text-xs font-mono text-gold font-bold ${styles.streakFlame}`}>
            🔥 {mission.streak} dias
          </span>
        )}
        {!(mission.type === 'daily' && mission.streak > 0) && <span />}

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
