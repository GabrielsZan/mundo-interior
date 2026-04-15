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

// Parchment-style label halo — no rectangular background
const LABEL_SHADOW = `
  0 0 5px rgba(232,213,160,1),
  0 0 10px rgba(232,213,160,0.90),
  1px 1px 0 rgba(232,213,160,0.95),
  -1px -1px 0 rgba(232,213,160,0.95),
  1px -1px 0 rgba(232,213,160,0.95),
  -1px  1px 0 rgba(232,213,160,0.95)
`

export function POIMarker({ poi, isRevealed, isVisited, isInvaded, isLocked, onTap, onResetDrag }: POIMarkerProps) {
  if (!isRevealed) return null

  const x = (poi.x / 100) * MAP_W
  const y = (poi.y / 100) * MAP_H

  const isCitadel   = poi.type === 'citadel'
  const isChallenge = poi.type === 'challenge'
  const domainColor = DOMAIN_COLOR_MAP[poi.domain] ?? '#888'

  const zIndex = isCitadel ? 10 : isChallenge ? 4 : 5

  // Structure sizes on the 3000×2000 map
  const imgSize = isCitadel ? 230 : 200

  // ── Challenge zone — pin-style (no illustration) ───────────────────────────
  if (isChallenge) {
    return (
      <div
        className="absolute flex flex-col items-center"
        style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex }}
      >
        <button
          onClick={() => onTap(poi)}
          onPointerDown={(e) => { onResetDrag(); e.stopPropagation() }}
          className={`flex items-center justify-center rounded-full
                     transition-transform duration-150 active:scale-90 hover:scale-110
                     ${styles.invasionPulse}`}
          style={{
            width: 44, height: 44,
            background: 'rgba(30,10,10,0.78)',
            border: '2.5px dashed #C2675A',
            boxShadow: '0 0 10px rgba(194,103,90,0.45), 0 3px 8px rgba(0,0,0,0.5)',
          }}
          title={poi.name}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>⚠️</span>
        </button>
      </div>
    )
  }

  // ── POIs with illustration ─────────────────────────────────────────────────
  const dropShadow = isCitadel
    ? `drop-shadow(0 6px 12px rgba(42,33,24,0.65)) drop-shadow(0 2px 4px rgba(212,168,67,0.30))`
    : `drop-shadow(0 5px 8px rgba(42,33,24,0.55)) drop-shadow(0 2px 3px rgba(42,33,24,0.35))`

  let imageFilter = dropShadow
  if (isInvaded)   imageFilter = `grayscale(1) brightness(0.55) ${dropShadow} drop-shadow(0 0 10px rgba(61,43,90,0.7))`
  if (isLocked)    imageFilter = `grayscale(0.6) brightness(0.55) ${dropShadow}`
  if (isVisited && !isInvaded && !isLocked) imageFilter = `${dropShadow} opacity(0.75)`

  const labelColor = isCitadel
    ? CITADEL_COLOR
    : isInvaded
      ? '#8B7332'
      : domainColor

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: x, top: y,
        // Anchor near the base of the structure (bottom ~85% sits at the coordinate)
        transform: `translate(-50%, -82%)`,
        zIndex,
        cursor: 'pointer',
      }}
    >
      <button
        onClick={() => onTap(poi)}
        onPointerDown={(e) => { onResetDrag(); e.stopPropagation() }}
        className={`relative transition-transform duration-150 active:scale-95 hover:scale-105
                   ${isInvaded ? styles.invasionPulse : ''}`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          width: imgSize,
          height: imgSize,
        }}
        title={isInvaded ? `${poi.name} — Invadido por Nyxos` : isLocked ? `${poi.name} — Bloqueado` : poi.name}
      >
        {poi.image ? (
          <>
            <img
              src={poi.image}
              alt={poi.name}
              draggable={false}
              style={{
                width: imgSize,
                height: imgSize,
                display: 'block',
                filter: imageFilter,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
            {/* Invaded skull badge */}
            {isInvaded && (
              <div
                className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none"
              >
                <span style={{
                  fontSize: imgSize * 0.28,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                }}>💀</span>
              </div>
            )}
            {/* Locked badge */}
            {isLocked && (
              <div
                className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none"
              >
                <span style={{
                  fontSize: imgSize * 0.28,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                }}>🔒</span>
              </div>
            )}
          </>
        ) : (
          /* Emoji fallback (no image available) */
          <div
            className="w-full h-full flex items-center justify-center rounded-xl"
            style={{
              background: `${domainColor}CC`,
              boxShadow: `0 4px 12px rgba(42,33,24,0.5)`,
            }}
          >
            <span style={{ fontSize: imgSize * 0.45, lineHeight: 1 }}>{poi.icon}</span>
          </div>
        )}
      </button>

      {/* Name label — sits just below the structure base */}
      <span
        className="font-heading italic text-center pointer-events-none select-none"
        style={{
          marginTop: '3px',
          fontSize: isCitadel ? '13px' : '11px',
          fontWeight: 600,
          color: labelColor,
          opacity: isVisited && !isInvaded ? 0.6 : 0.92,
          textShadow: LABEL_SHADOW,
          letterSpacing: isCitadel ? '0.06em' : '0.02em',
          maxWidth: isCitadel ? '120px' : '96px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        {poi.name}
      </span>
    </div>
  )
}
