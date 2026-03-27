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

  return (
    <button
      onClick={() => onTap(poi)}
      className="absolute flex items-center justify-center rounded-full shadow-lg
                 transition-transform duration-150 active:scale-90 hover:scale-110 z-[5]"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        background: bg,
        opacity: isVisited ? 0.8 : 1,
        border: `2px solid rgba(255,255,255,${poi.type === 'citadel' ? 0.8 : 0.5})`,
        zIndex: poi.type === 'citadel' ? 10 : poi.type === 'challenge' ? 4 : 5,
        boxShadow: poi.type === 'citadel'
          ? `0 0 0 4px ${bg}40, 0 4px 16px rgba(0,0,0,0.5)`
          : '0 2px 8px rgba(0,0,0,0.4)',
      }}
      title={poi.name}
    >
      <span style={{ fontSize: iconSize, lineHeight: 1 }}>{poi.icon}</span>
    </button>
  )
}
