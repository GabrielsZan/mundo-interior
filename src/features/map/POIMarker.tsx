import type { POI } from './mapData'
import { MAP_W, MAP_H } from './mapData'
import styles from './map.module.css'

interface POIMarkerProps {
  poi:          POI
  isRevealed:   boolean
  isVisited:    boolean
  isInvaded:    boolean
  isLocked:     boolean
  onTap:        (poi: POI) => void
  onResetDrag:  () => void
}

const DOMAIN_COLOR_MAP: Record<string, string> = {
  mente:   '#5B8C5A',
  corpo:   '#C67B5C',
  alma:    '#6BA3B7',
  criacao: '#B8976A',
}

const CITADEL_COLOR = '#D4A843'

const LABEL_SHADOW = `
  0 0 4px rgba(232,213,160,0.98),
  0 0 8px rgba(232,213,160,0.85),
  1px 1px 0 rgba(232,213,160,0.90),
  -1px -1px 0 rgba(232,213,160,0.90),
  1px -1px 0 rgba(232,213,160,0.90),
  -1px  1px 0 rgba(232,213,160,0.90)
`

function POIImage({ src, size }: { src: string; size: number }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{
        width:  size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  )
}

export function POIMarker({ poi, isRevealed, isVisited, isInvaded, isLocked, onTap, onResetDrag }: POIMarkerProps) {
  if (!isRevealed) return null

  const x = (poi.x / 100) * MAP_W
  const y = (poi.y / 100) * MAP_H

  const domainColor = DOMAIN_COLOR_MAP[poi.domain] ?? '#888'

  const isCitadel   = poi.type === 'citadel'
  const isChallenge = poi.type === 'challenge'

  // Marker sizes — larger to fit the 3000×2000 map
  const size     = isCitadel ? 72 : isChallenge ? 44 : 60
  const iconSize = isCitadel ? 28 : isChallenge ? 18 : 22
  const zIndex   = isCitadel ? 10 : isChallenge ? 4 : 5

  // ── Invaded ────────────────────────────────────────────────────────────────
  if (isInvaded) {
    return (
      <div
        className="absolute flex flex-col items-center"
        style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex }}
      >
        <button
          onClick={() => onTap(poi)}
          onPointerDown={(e) => { onResetDrag(); e.stopPropagation() }}
          className={`relative flex items-center justify-center rounded-full
                     transition-transform duration-150 active:scale-90 hover:scale-110
                     ${styles.invasionPulse}`}
          style={{
            width: size, height: size,
            background: 'rgba(20,10,30,0.85)',
            border: '3px solid #8B7332',
            boxShadow: '0 0 0 3px rgba(61,43,90,0.5), 0 0 18px rgba(61,43,90,0.5)',
            filter: 'grayscale(0.7) brightness(0.75)',
            overflow: 'hidden',
          }}
          title={`${poi.name} — Invadido por Nyxos`}
        >
          {poi.image
            ? <POIImage src={poi.image} size={size} />
            : <span style={{ fontSize: iconSize, lineHeight: 1, opacity: 0.5 }}>{poi.icon}</span>
          }
          {/* Dark overlay + skull */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(20,10,30,0.55)', borderRadius: '50%' }}
          >
            <span style={{ fontSize: iconSize * 0.7, lineHeight: 1, opacity: 0.9 }}>💀</span>
          </div>
        </button>
        <span
          className="mt-1 font-heading italic text-center pointer-events-none select-none"
          style={{
            fontSize: isCitadel ? '12px' : '10px',
            color: '#8B7332',
            textShadow: LABEL_SHADOW,
            letterSpacing: '0.02em',
            maxWidth: '88px',
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          {poi.name}
        </span>
      </div>
    )
  }

  // ── Normal ─────────────────────────────────────────────────────────────────
  const borderColor = isCitadel
    ? CITADEL_COLOR
    : isChallenge
      ? '#C2675A'
      : domainColor

  const boxShadow = isCitadel
    ? `0 0 0 4px ${CITADEL_COLOR}55, 0 0 18px rgba(212,168,67,0.55), 0 4px 14px rgba(42,33,24,0.5)`
    : isChallenge
      ? '0 0 10px rgba(194,103,90,0.40), 0 3px 10px rgba(42,33,24,0.5)'
      : `0 0 0 2px ${domainColor}44, 0 3px 10px rgba(42,33,24,0.45)`

  const labelColor = isCitadel ? CITADEL_COLOR : '#2A2118'

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: x, top: y,
        transform: 'translate(-50%, -50%)',
        zIndex,
        opacity: isLocked ? 0.45 : isVisited ? 0.82 : 1,
      }}
    >
      <button
        onClick={() => onTap(poi)}
        onPointerDown={(e) => { onResetDrag(); e.stopPropagation() }}
        className="relative flex items-center justify-center rounded-full
                   transition-transform duration-150 active:scale-90 hover:scale-110"
        style={{
          width:  size,
          height: size,
          overflow: 'hidden',
          border: isChallenge
            ? `3px dashed ${borderColor}`
            : `3px solid ${borderColor}`,
          boxShadow,
          background: poi.image
            ? 'transparent'
            : isCitadel
              ? CITADEL_COLOR
              : isChallenge
                ? 'rgba(30,18,12,0.72)'
                : `${domainColor}CC`,
        }}
        title={isLocked ? `${poi.name} — Bloqueado` : poi.name}
      >
        {/* Image or emoji content */}
        {poi.image && !isChallenge
          ? <POIImage src={poi.image} size={size} />
          : <span style={{ fontSize: iconSize, lineHeight: 1 }}>{poi.icon}</span>
        }

        {/* Locked overlay */}
        {isLocked && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.42)', borderRadius: '50%' }}
          >
            <span style={{ fontSize: iconSize * 0.75, lineHeight: 1 }}>🔒</span>
          </div>
        )}

        {/* Citadel glow ring */}
        {isCitadel && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: `inset 0 0 12px rgba(212,168,67,0.40)` }}
          />
        )}
      </button>

      {/* Label — hidden for challenge zones */}
      {!isChallenge && (
        <span
          className="mt-1.5 font-heading italic text-center pointer-events-none select-none"
          style={{
            fontSize: isCitadel ? '12px' : '10px',
            color: labelColor,
            opacity: isVisited ? 0.65 : 0.9,
            textShadow: LABEL_SHADOW,
            letterSpacing: isCitadel ? '0.05em' : '0.02em',
            maxWidth: isCitadel ? '100px' : '80px',
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
