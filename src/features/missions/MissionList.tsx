import { useState } from 'react'
import { useMissionStore } from '@/stores/missionStore'
import { useMapStore } from '@/stores/mapStore'
import { MissionCard } from './MissionCard'
import { AddMissionModal } from './AddMissionModal'
import { MISSION_TYPE_LABELS } from '@/types'
import type { MissionType } from '@/types'
import { ALL_MAP_MISSIONS } from '@/lib/mapMissions'
import { mapPOIs } from '@/features/map/mapData'

type Tab = MissionType | 'world'

const MISSION_TABS: MissionType[] = ['daily', 'main', 'epic']

const COLOR_MAP: Record<string, string> = {
  mente:   '#5B8C5A',
  corpo:   '#C67B5C',
  alma:    '#6BA3B7',
  criacao: '#B8976A',
}

// ── World Missions Tab ────────────────────────────────────────────────────────

function WorldMissionsTab() {
  const revealedPois         = useMapStore((s) => s.revealedPois)
  const completedMapMissions = useMapStore((s) => s.completedMapMissions)
  const completedPois        = useMapStore((s) => s.completedPois)
  const completeMapMission   = useMapStore((s) => s.completeMapMission)
  const isPOIInvaded         = useMapStore((s) => s.isPOIInvaded)
  const isPOILocked          = useMapStore((s) => s.isPOILocked)

  const visiblePOIs = mapPOIs.filter(
    (p) => p.type !== 'citadel' && revealedPois.includes(p.id)
  )

  if (visiblePOIs.length === 0) {
    return (
      <div className="text-center py-10 text-ink/30 text-sm font-body">
        Explore o mapa para desbloquear missões do mundo.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {visiblePOIs.map((poi) => {
        const missions     = ALL_MAP_MISSIONS
          .filter((m) => m.poiId === poi.id)
          .sort((a, b) => a.order - b.order)
        const doneMissions = missions.filter((m) => completedMapMissions.includes(m.id))
        const allDone      = completedPois.includes(poi.id)
        const invaded      = isPOIInvaded(poi.id)
        const locked       = isPOILocked(poi.id)
        const color        = poi.type === 'challenge'
          ? '#C2675A'
          : (COLOR_MAP[poi.domain] ?? '#888')

        return (
          <div key={poi.id} className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* Color bar */}
            <div className="h-1" style={{ background: invaded ? '#8B7332' : color }} />

            <div className="px-4 pt-3 pb-3">
              {/* POI header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl leading-none">{poi.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-heading font-bold italic text-sm leading-tight truncate"
                    style={{ color: invaded ? '#8B7332' : color }}
                  >
                    {poi.name}
                  </h3>
                  <p className="text-xs text-ink/40 font-body">
                    {invaded
                      ? '⚔️ Invadido por Nyxos'
                      : locked
                        ? '🔒 Bloqueado'
                        : allDone
                          ? '✓ Completo'
                          : `${doneMissions.length}/${missions.length} missões`}
                  </p>
                </div>
              </div>

              {/* Mission rows */}
              {!locked && missions.map((mission) => {
                const done = completedMapMissions.includes(mission.id)
                return (
                  <div
                    key={mission.id}
                    className="flex items-center gap-2.5 py-2 border-t"
                    style={{ borderColor: 'rgba(42,33,24,0.07)' }}
                  >
                    {/* Checkbox */}
                    <button
                      disabled={done || invaded}
                      onClick={() => completeMapMission(mission.id, poi.id)}
                      className="w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors"
                      style={{
                        background: done ? color : 'transparent',
                        border:     `2px solid ${done ? color : 'rgba(42,33,24,0.2)'}`,
                        cursor:     done || invaded ? 'default' : 'pointer',
                        opacity:    invaded ? 0.4 : 1,
                      }}
                      title={done ? 'Concluída' : 'Completar'}
                    >
                      {done && (
                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4l3 3 5-6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Name */}
                    <p
                      className="flex-1 text-xs font-semibold leading-snug"
                      style={{
                        color:          done ? 'rgba(42,33,24,0.35)' : '#2A2118',
                        textDecoration: done ? 'line-through' : 'none',
                      }}
                    >
                      {mission.name}
                    </p>

                    {/* XP */}
                    <span
                      className="text-xs font-mono shrink-0"
                      style={{ color: done ? 'rgba(42,33,24,0.25)' : color }}
                    >
                      +{mission.xpGeneral}
                    </span>
                  </div>
                )
              })}

              {locked && (
                <p className="text-xs text-ink/40 italic font-body pt-1">
                  Reconquiste o local invadido para desbloquear.
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── MissionList ───────────────────────────────────────────────────────────────

export function MissionList() {
  const missions = useMissionStore((s) => s.missions)

  // For world tab badge: pending missions across revealed, non-locked POIs
  const revealedPois         = useMapStore((s) => s.revealedPois)
  const completedMapMissions = useMapStore((s) => s.completedMapMissions)
  const completedPois        = useMapStore((s) => s.completedPois)
  const isPOILocked          = useMapStore((s) => s.isPOILocked)
  const isPOIInvaded         = useMapStore((s) => s.isPOIInvaded)

  const [tab,     setTab]     = useState<Tab>('daily')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = tab !== 'world'
    ? missions.filter((m) => m.type === tab)
    : []
  const pending = filtered.filter((m) => !m.isCompleted)
  const done    = filtered.filter((m) =>  m.isCompleted)

  // Count pending world missions
  const worldPending = mapPOIs
    .filter((p) =>
      p.type !== 'citadel' &&
      revealedPois.includes(p.id) &&
      !isPOILocked(p.id) &&
      !isPOIInvaded(p.id) &&
      !completedPois.includes(p.id)
    )
    .reduce((acc, p) => {
      const total = ALL_MAP_MISSIONS.filter((m) => m.poiId === p.id).length
      const doneCount = ALL_MAP_MISSIONS.filter(
        (m) => m.poiId === p.id && completedMapMissions.includes(m.id)
      ).length
      return acc + (total - doneCount)
    }, 0)

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg italic font-semibold text-ink">Missões</h2>
        {tab !== 'world' && (
          <button
            onClick={() => setShowAdd(true)}
            className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
          >
            + Nova
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-parchment-dark rounded-card p-1">
        {MISSION_TABS.map((t) => {
          const count = missions.filter((m) => m.type === t && !m.isCompleted).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                flex-1 py-1.5 text-[10px] font-semibold rounded-[8px] transition-all
                ${tab === t
                  ? 'bg-white text-ink shadow-card'
                  : 'text-ink/50 hover:text-ink/80'}
              `}
            >
              {MISSION_TYPE_LABELS[t]}
              {count > 0 && (
                <span className="ml-0.5 text-gold font-mono">({count})</span>
              )}
            </button>
          )
        })}

        {/* Mundo tab */}
        <button
          onClick={() => setTab('world')}
          className={`
            flex-1 py-1.5 text-[10px] font-semibold rounded-[8px] transition-all
            ${tab === 'world'
              ? 'bg-white text-ink shadow-card'
              : 'text-ink/50 hover:text-ink/80'}
          `}
        >
          Mundo
          {worldPending > 0 && (
            <span className="ml-0.5 font-mono" style={{ color: '#5B8C5A' }}>({worldPending})</span>
          )}
        </button>
      </div>

      {/* Content */}
      {tab === 'world' ? (
        <WorldMissionsTab />
      ) : (
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
      )}

      {showAdd && <AddMissionModal onClose={() => setShowAdd(false)} />}
    </section>
  )
}
