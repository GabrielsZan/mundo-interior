import { DOMAIN_COLORS } from '@/types'
import type { IPOI } from './mapData'
import { MAP_W, MAP_H } from './mapData'

interface POIMarkerProps {
  poi: IPOI
  isRevealed: boolean
  isVisited: boolean
  onTap: (poi: IPOI) => void
}

const DOMAIN_COLOR_MAP: Record<string, string> = {
  ...DOMAIN_COLORS,
  center: '#D4A843',
}

const CHALLENGE_COLOR = '#7A4C4C'

export function POIMarker({ poi, isRevealed, isVisited, onTap }: POIMarkerProps) {
  if (!isRevealed) return null

  const x = (poi.x / 100) * MAP_W
  const y = (poi.y / 100) * MAP_H

  const bg =
    poi.type === 'challenge'
      ? CHALLENGE_COLOR
      : DOMAIN_COLOR_MAP[poi.domain] ?? '#888'

  const size =
    poi.type === 'citadel' ? 54
    : poi.type === 'challenge' ? 34
    : 40

  const iconSize =
    poi.type === 'citadel' ? 24
    : poi.type === 'challenge' ? 14
    : 17

  const zIndex = poi.type === 'citadel' ? 10 : poi.type === 'challenge' ? 4 : 5

  // Parchment-toned label halo (textShadow technique — no rectangular bg box)
  const labelShadow = `
    0 0 3px rgba(232,213,160,0.95),
    0 0 7px rgba(232,213,160,0.80),
    1px 1px 0 rgba(232,213,160,0.85),
    -1px -1px 0 rgba(232,213,160,0.85),
    1px -1px 0 rgba(232,213,160,0.85),
    -1px  1px 0 rgba(232,213,160,0.85)
  `

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex }}
    >
      {/* Icon button */}
      <button
        onClick={() => onTap(poi)}
        className="flex items-center justify-center rounded-full
                   transition-transform duration-150 active:scale-90 hover:scale-110"
        style={{
          width: size,
          height: size,
          background: bg,
          opacity: isVisited ? 0.82 : 1,
          border: poi.type === 'citadel'
            ? '2.5px solid rgba(212,168,67,0.90)'
            : '2px solid rgba(232,213,160,0.75)',
          boxShadow: poi.type === 'citadel'
            ? `0 0 0 3px ${bg}50, 0 0 12px rgba(212,168,67,0.4), 0 3px 12px rgba(42,33,24,0.5)`
            : poi.type === 'challenge'
              ? '0 0 8px rgba(42,33,24,0.6), inset 0 1px 0 rgba(255,255,255,0.12)'
              : '0 2px 8px rgba(42,33,24,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
        title={poi.name}
      >
        <span style={{ fontSize: iconSize, lineHeight: 1 }}>{poi.icon}</span>
      </button>

      {/* Name label — hidden for challenges (name is the reveal on tap) */}
      {poi.type !== 'challenge' && (
        <span
          className="mt-1 font-heading italic text-center pointer-events-none select-none"
          style={{
            fontSize: poi.type === 'citadel' ? '10px' : '8.5px',
            color: '#2A2118',
            opacity: isVisited ? 0.65 : 0.85,
            textShadow: labelShadow,
            letterSpacing: poi.type === 'citadel' ? '0.05em' : '0.02em',
            maxWidth: poi.type === 'citadel' ? '90px' : '72px',
            lineHeight: 1.2,
            whiteSpace: poi.type === 'citadel' ? 'nowrap' : 'normal',
            textAlign: 'center',
          }}
        >
          {poi.name}
        </span>
      )}
    </div>
  )
}
