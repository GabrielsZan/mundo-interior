import type { POI } from './mapData'

interface POISheetProps {
  poi: POI | null
  onClose: () => void
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

export function POISheet({ poi, onClose }: POISheetProps) {
  if (!poi) return null

  const color = poi.type === 'challenge' ? '#C2675A' : (COLOR_MAP[poi.domain] ?? '#888')
  const label = LABEL_MAP[poi.domain] ?? poi.domain

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-3 pb-2">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Color bar */}
          <div className="h-1" style={{ background: color }} />

          <div className="p-5">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${color}22`, border: `2px solid ${color}44` }}
              >
                {poi.icon}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-bold text-lg italic text-ink leading-tight">
                  {poi.name}
                </h2>
                <span className="text-xs font-semibold" style={{ color }}>
                  {poi.type === 'challenge' ? '⚠️ Zona de Desafio' : label}
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

            {poi.type === 'citadel' && (
              <p className="mt-3 text-xs text-ink/30 italic font-body">
                A Cidadela evolui conforme você cresce. Novos segredos serão revelados em breve.
              </p>
            )}

            {poi.type === 'challenge' && (
              <p className="mt-3 text-xs font-body" style={{ color }}>
                Zonas de desafio representam obstáculos internos a serem superados.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
