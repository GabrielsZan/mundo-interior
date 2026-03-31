import type { POI } from './mapData'
import { MAP_W, MAP_H } from './mapData'
import styles from './map.module.css'

interface POIMarkerProps {
  poi:        POI
  isRevealed: boolean
  isVisited:  boolean
  isInvaded:  boolean
  isLocked:   boolean
  onTap:      (poi: POI) => void
}

const DOMAIN_COLOR_MAP: Record<string, string> = {
  mente:   '#5B8C5A',
  corpo:   '#C67B5C',
  alma:    '#6BA3B7',
  criacao: '#B8976A',
}

const CITADEL_COLOR = '#D4A843'

// Parchment label halo via text-shadow (no rectangular bg)
const LABEL_SHADOW = `
  0 0 3px rgba(232,213,160,0.95),
  0 0 7px rgba(232,213,160,0.80),
  1px 1px 0 rgba(232,213,160,0.85),
  -1px -1px 0 rgba(232,213,160,0.85),
  1px -1px 0 rgba(232,213,160,0.85),
  -1px  1px 0 rgba(232,213,160,0.85)
`

export function POIMarker({ poi, isRevealed, isVisited, isInvaded, isLocked, onTap }: POIMarkerProps) {
  if (!isRevealed) return null

  const x = (poi.x / 100) * MAP_W
  const y = (poi.y / 100) * MAP_H

  const domainColor = DOMAIN_COLOR_MAP[poi.domain] ?? '#888'

  const isCitadel   = poi.type === 'citadel'
  const isChallenge = poi.type === 'challenge'

  const size     = isCitadel ? 48 : 36
  const iconSize = isCitadel ? 22 : isChallenge ? 14 : 16
  const zIndex   = isCitadel ? 10 : isChallenge ? 4 : 5

  // ── Invaded overrides ──────────────────────────────────────────────────────
  if (isInvaded) {
    return (
      <div
        className="absolute flex flex-col items-center"
        style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex }}
      >
        <button
          onClick={() => onTap(poi)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex items-center justify-center rounded-full
                     transition-transform duration-150 active:scale-90 hover:scale-110
                     ${styles.invasionPulse}`}
          style={{
            width:  size,
            height: size,
            background: 'rgba(20,10,30,0.85)',
            border: '2.5px solid #8B7332',
            boxShadow: '0 0 0 3px rgba(61,43,90,0.5), 0 0 16px rgba(61,43,90,0.5)',
            filter: 'grayscale(0.7) brightness(0.75)',
          }}
          title={`${poi.name} — Invadido por Nyxos`}
        >
          <span style={{ fontSize: iconSize, lineHeight: 1, opacity: 0.5 }}>{poi.icon}</span>
        </button>
        <span
          className="mt-1 font-heading italic text-center pointer-events-none select-none"
          style={{
            fontSize: isCitadel ? '10px' : '8.5px',
            color: '#8B7332',
            textShadow: LABEL_SHADOW,
            letterSpacing: '0.02em',
            maxWidth: '72px',
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          {poi.name}
        </span>
      </div>
    )
  }

  // ── Normal rendering ───────────────────────────────────────────────────────
  const bg = isChallenge
    ? 'rgba(30,18,12,0.72)'
    : isCitadel
      ? CITADEL_COLOR
      : `${domainColor}CC`

  const border = isCitadel
    ? `2.5px solid ${CITADEL_COLOR}`
    : isChallenge
      ? '2px dashed #C2675A'
      : `2px solid ${domainColor}`

  const boxShadow = isCitadel
    ? `0 0 0 3px ${CITADEL_COLOR}44, 0 0 14px rgba(212,168,67,0.50), 0 3px 12px rgba(42,33,24,0.5)`
    : isChallenge
      ? '0 0 8px rgba(194,103,90,0.35), 0 2px 8px rgba(42,33,24,0.5)'
      : `0 2px 8px rgba(42,33,24,0.40), inset 0 1px 0 rgba(255,255,255,0.18)`

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: x, top: y,
        transform: 'translate(-50%, -50%)',
        zIndex,
        opacity: isLocked ? 0.45 : 1,
      }}
    >
      <button
        onClick={() => onTap(poi)}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex items-center justify-center rounded-full
                   transition-transform duration-150 active:scale-90 hover:scale-110"
        style={{
          width:  size,
          height: size,
          background: bg,
          opacity: isVisited ? 0.82 : 1,
          border,
          boxShadow,
        }}
        title={isLocked ? `${poi.name} — Bloqueado por Nyxos` : poi.name}
      >
        <span style={{ fontSize: iconSize, lineHeight: 1 }}>{poi.icon}</span>
      </button>

      {/* Label — hidden for challenge zones */}
      {!isChallenge && (
        <span
          className="mt-1 font-heading italic text-center pointer-events-none select-none"
          style={{
            fontSize: isCitadel ? '10px' : '8.5px',
            color: '#2A2118',
            opacity: isVisited ? 0.65 : 0.88,
            textShadow: LABEL_SHADOW,
            letterSpacing: isCitadel ? '0.05em' : '0.02em',
            maxWidth: isCitadel ? '90px' : '72px',
            lineHeight: 1.2,
            whiteSpace: isCitadel ? 'nowrap' : 'normal',
            textAlign: 'center',
          }}
        >
          {poi.name}
        </span>
      )}
    </div>
  )
}
