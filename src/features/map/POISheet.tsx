import { useMapStore } from '@/stores/mapStore'
import type { POI } from './mapData'

interface POISheetProps {
  poi:             POI | null
  onClose:         () => void
  onOpenCitadel?: () => void
}

const COLOR_MAP: Record<string, string> = {
  mente:   '#5B8C5A',
  corpo:   '#C67B5C',
  alma:    '#6BA3B7',
  criacao: '#B8976A',
}

const LABEL_MAP: Record<string, string> = {
  mente:   'Mente',
  corpo:   'Corpo',
  alma:    'Alma',
  criacao: 'Criação',
}

const MISSION_TYPE_LABELS: Record<string, string> = {
  main:  'Principal',
  epic:  'Épica',
  daily: 'Diária',
}

export function POISheet({ poi, onClose, onOpenCitadel }: POISheetProps) {
  const getMissionsForPOI   = useMapStore((s) => s.getMissionsForPOI)
  const completedMapMissions = useMapStore((s) => s.completedMapMissions)
  const completeMapMission  = useMapStore((s) => s.completeMapMission)
  const isPOIInvaded        = useMapStore((s) => s.isPOIInvaded)
  const isPOILocked         = useMapStore((s) => s.isPOILocked)
  const reconquerPOI        = useMapStore((s) => s.reconquerPOI)

  if (!poi) return null

  const color   = poi.type === 'challenge' ? '#C2675A' : (COLOR_MAP[poi.domain] ?? '#888')
  const label   = LABEL_MAP[poi.domain] ?? poi.domain
  const invaded = poi.type !== 'citadel' && isPOIInvaded(poi.id)
  const locked  = poi.type !== 'citadel' && isPOILocked(poi.id)

  const missions = getMissionsForPOI(poi.id)
  const allDone  = missions.length > 0 && missions.every((m) => completedMapMissions.includes(m.id))

  // Nyxos tentação info per domain
  const TENTACOES: Record<string, { name: string; frase: string }> = {
    mente:   { name: 'A Paralisia da Análise',  frase: 'Por que agir se você pode planejar mais?' },
    corpo:   { name: 'O Conforto Eterno',       frase: 'Descanse mais, você merece. Amanhã você treina.' },
    alma:    { name: 'O Isolamento Dourado',    frase: 'Você não precisa de ninguém. Fique na sua.' },
    criacao: { name: 'A Perfeição Infinita',    frase: 'Não publique ainda. Não está bom o suficiente.' },
  }
  const tentacao = TENTACOES[poi.domain]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-3 pb-2">
        <div
          className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 7rem)' }}
        >
          {/* Color bar — fixed at top */}
          <div className="h-1 shrink-0" style={{ background: invaded ? '#8B7332' : color }} />

          <div className="p-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{
                  background: invaded ? 'rgba(139,115,50,0.12)' : `${color}22`,
                  border: `2px solid ${invaded ? '#8B7332' : color}44`,
                  filter: invaded ? 'grayscale(0.6)' : 'none',
                }}
              >
                {poi.icon}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-bold text-lg italic text-ink leading-tight">
                  {poi.name}
                </h2>
                <span className="text-xs font-semibold" style={{ color: invaded ? '#8B7332' : color }}>
                  {invaded
                    ? '⚔️ Invadido por Nyxos'
                    : locked
                      ? '🔒 Bloqueado por Nyxos'
                      : poi.type === 'challenge'
                        ? '⚠️ Zona de Desafio'
                        : label}
                </span>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="text-ink/30 hover:text-ink text-2xl leading-none mt-0.5"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm text-ink/60 font-body leading-relaxed">
              {poi.description}
            </p>

            {/* ── Invaded state ─────────────────────────────────────────────── */}
            {invaded && tentacao && (
              <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(61,43,90,0.07)', border: '1px solid rgba(139,115,50,0.3)' }}>
                <p className="text-xs font-semibold" style={{ color: '#8B7332' }}>
                  Tentação de Nyxos: {tentacao.name}
                </p>
                <p className="mt-1 text-sm italic text-ink/60 font-body">
                  "{tentacao.frase}"
                </p>
                <p className="mt-2 text-xs text-ink/40 font-body">
                  Reconquiste completando as missões novamente.
                </p>
                <button
                  onClick={() => { reconquerPOI(poi.id); onClose() }}
                  className="mt-3 w-full py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: '#8B7332', color: '#FBF6F0' }}
                >
                  Reconquistar
                </button>
              </div>
            )}

            {/* ── Locked state ──────────────────────────────────────────────── */}
            {locked && !invaded && (
              <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(61,43,90,0.07)', border: '1px solid rgba(61,43,90,0.2)' }}>
                <p className="text-sm text-ink/50 font-body italic">
                  🔒 Este local está bloqueado porque Nyxos invadiu um local anterior nesta região. Reconquiste o local invadido primeiro.
                </p>
              </div>
            )}

            {/* ── Citadel ───────────────────────────────────────────────────── */}
            {poi.type === 'citadel' && (
              <div className="mt-4">
                <p className="text-xs text-ink/40 italic font-body mb-3">
                  A Cidadela evolui conforme você cresce. Aqui residem os guardiões dos domínios e os desafios da semana.
                </p>
                {onOpenCitadel && (
                  <button
                    onClick={() => { onClose(); onOpenCitadel() }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ background: '#D4A843', color: '#FBF6F0' }}
                  >
                    🏰 Entrar na Cidadela
                  </button>
                )}
              </div>
            )}

            {/* ── Mission list ──────────────────────────────────────────────── */}
            {missions.length > 0 && !locked && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-ink/50 uppercase tracking-wide">
                    Missões
                  </h3>
                  {allDone && (
                    <span className="text-xs font-semibold" style={{ color }}>
                      ✓ Completo!
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {missions.map((mission) => {
                    const done = completedMapMissions.includes(mission.id)
                    return (
                      <div
                        key={mission.id}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{
                          background: done ? `${color}14` : 'rgba(42,33,24,0.04)',
                          border: `1px solid ${done ? color + '40' : 'rgba(42,33,24,0.08)'}`,
                          opacity: invaded ? 0.5 : 1,
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          disabled={done || invaded}
                          onClick={() => completeMapMission(mission.id, poi.id)}
                          className="mt-0.5 w-5 h-5 rounded shrink-0 flex items-center justify-center transition-colors"
                          style={{
                            background: done ? color : 'transparent',
                            border: `2px solid ${done ? color : 'rgba(42,33,24,0.2)'}`,
                            cursor: done || invaded ? 'default' : 'pointer',
                          }}
                          title={done ? 'Concluída' : 'Completar missão'}
                        >
                          {done && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold leading-snug"
                            style={{
                              color: done ? 'rgba(42,33,24,0.4)' : '#2A2118',
                              textDecoration: done ? 'line-through' : 'none',
                            }}
                          >
                            {mission.name}
                          </p>
                          <p className="text-xs text-ink/50 mt-0.5 leading-snug font-body">
                            {mission.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className="text-xs font-mono px-1.5 py-0.5 rounded"
                              style={{ background: `${color}22`, color }}
                            >
                              +{mission.xpGeneral} XP
                            </span>
                            <span className="text-xs text-ink/30 font-body">
                              {MISSION_TYPE_LABELS[mission.type] ?? mission.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
