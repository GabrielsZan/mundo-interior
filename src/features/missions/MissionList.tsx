import { useState } from 'react'
import { useMissionStore } from '@/stores/missionStore'
import { MissionCard } from './MissionCard'
import { AddMissionModal } from './AddMissionModal'
import { MISSION_TYPE_LABELS } from '@/types'
import type { MissionType } from '@/types'

const TABS: MissionType[] = ['daily', 'main', 'epic']

export function MissionList() {
  const missions       = useMissionStore((s) => s.missions)
  const [tab, setTab]  = useState<MissionType>('daily')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = missions.filter((m) => m.type === tab)
  const pending  = filtered.filter((m) => !m.isCompleted)
  const done     = filtered.filter((m) =>  m.isCompleted)

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg italic font-semibold text-ink">Missões</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
        >
          + Nova
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-parchment-dark rounded-card p-1">
        {TABS.map((t) => {
          const count = missions.filter((m) => m.type === t && !m.isCompleted).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all
                ${tab === t
                  ? 'bg-white text-ink shadow-card'
                  : 'text-ink/50 hover:text-ink/80'}
              `}
            >
              {MISSION_TYPE_LABELS[t]}
              {count > 0 && (
                <span className="ml-1 text-gold font-mono">({count})</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Mission cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-ink/30 text-sm">
            Nenhuma missão {MISSION_TYPE_LABELS[tab].toLowerCase()} ainda.
            <br />
            <button
              onClick={() => setShowAdd(true)}
              className="text-gold font-semibold mt-1 hover:text-gold-dark"
            >
              Criar a primeira
            </button>
          </div>
        )}

        {pending.map((m) => <MissionCard key={m.id} mission={m} />)}

        {done.length > 0 && (
          <>
            <p className="text-xs text-ink/30 font-semibold uppercase tracking-wide mt-2">
              Concluídas ({done.length})
            </p>
            {done.map((m) => <MissionCard key={m.id} mission={m} />)}
          </>
        )}
      </div>

      {showAdd && <AddMissionModal onClose={() => setShowAdd(false)} />}
    </section>
  )
}
