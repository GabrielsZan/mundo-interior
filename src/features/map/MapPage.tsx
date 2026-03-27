import { useRef, useState, useCallback } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useMapStore } from '@/stores/mapStore'
import { DOMAIN_COLORS } from '@/types'
import { POIS, MAP_W, MAP_H } from './mapData'
import type { IPOI } from './mapData'
import { FogCanvas } from './FogCanvas'
import { POIMarker } from './POIMarker'
import { POISheet } from './POISheet'

const FOG_RADIUS_REGULAR = 175
const FOG_RADIUS_CITADEL = 260

// ── Terrain background ────────────────────────────────────────────────────────

function MapTerrain() {
  return (
    <div
      className="absolute inset-0 select-none"
      style={{
        background: `
          radial-gradient(ellipse 65% 45% at 50% 0%,   #7A9BB5 0%, transparent 65%),
          radial-gradient(ellipse 65% 45% at 50% 100%, #B8805A 0%, transparent 65%),
          radial-gradient(ellipse 45% 65% at 100% 50%, #5E9BAD 0%, transparent 65%),
          radial-gradient(ellipse 45% 65% at 0%   50%, #4E7C4E 0%, transparent 65%),
          radial-gradient(ellipse 28% 28% at 50%  50%, #C9A048 0%, transparent 55%),
          #7B6B52
        `,
      }}
    >
      {/* Region labels */}
      <span className="absolute top-3 left-1/2 -translate-x-1/2 text-white/25 text-[10px] font-mono uppercase tracking-[0.2em]">
        Norte · Mente
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/25 text-[10px] font-mono uppercase tracking-[0.2em]">
        Sul · Corpo
      </span>
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-[10px] font-mono uppercase tracking-[0.2em]"
        style={{ writingMode: 'vertical-rl' }}
      >
        Leste · Alma
      </span>
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-[10px] font-mono uppercase tracking-[0.2em]"
        style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
      >
        Oeste · Criação
      </span>

      {/* SVG terrain details */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="none"
      >
        {/* Mountain range — North */}
        <path
          d="M 480 210 L 540 130 L 600 210 L 660 95 L 720 210 L 790 140 L 850 210"
          stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" fill="none"
        />
        <path
          d="M 300 240 L 340 185 L 380 240 L 420 160 L 460 240"
          stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none"
        />

        {/* River — East (Soul) */}
        <path
          d="M 1600 380 Q 1200 400 1000 430 Q 900 445 800 450"
          stroke="#6BA3B7" strokeWidth="6" fill="none" opacity="0.3"
        />

        {/* Forest clusters — West (Creation) */}
        {[
          [130, 330], [190, 310], [155, 380], [110, 410], [200, 370],
          [145, 460], [190, 440], [120, 500], [170, 510], [215, 490],
          [105, 560], [160, 580], [200, 550],
        ].map(([cx, cy], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={22} ry={16} fill="rgba(60,100,50,0.35)" />
        ))}

        {/* Plains lines — South (Body) */}
        {[690, 730, 770, 810].map((y, i) => (
          <path
            key={i}
            d={`M 150 ${y} Q 500 ${y - 15} 900 ${y + 10} Q 1200 ${y + 20} 1450 ${y}`}
            stroke="rgba(180,120,70,0.2)" strokeWidth="1.5" fill="none"
          />
        ))}

        {/* Water shimmer — East */}
        {[350, 380, 410, 440, 470, 500, 530].map((y, i) => (
          <path
            key={i}
            d={`M ${1300 + i * 10} ${y} Q ${1400 + i * 5} ${y + 8} ${1500 - i * 8} ${y + 2}`}
            stroke="rgba(107,163,183,0.25)" strokeWidth="1.5" fill="none"
          />
        ))}

        {/* Center — subtle glow ring */}
        <circle cx={MAP_W / 2} cy={MAP_H / 2} r={90} fill="rgba(212,168,67,0.08)" />
        <circle cx={MAP_W / 2} cy={MAP_H / 2} r={140} fill="none" stroke="rgba(212,168,67,0.06)" strokeWidth="1" />
      </svg>
    </div>
  )
}

// ── MapPage ───────────────────────────────────────────────────────────────────

export function MapPage() {
  const player    = usePlayerStore((s) => s.player)!
  const visited   = useMapStore((s) => s.visitedPOIs)
  const visitPOI  = useMapStore((s) => s.visitPOI)

  const [selectedPOI, setSelectedPOI] = useState<IPOI | null>(null)

  // ── Pan state ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const offsetRef    = useRef({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragInfo     = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)
  const didDrag      = useRef(false)

  function applyOffset(x: number, y: number) {
    const vw = containerRef.current?.clientWidth  ?? 390
    const vh = containerRef.current?.clientHeight ?? 700
    const maxX = MAP_W / 2 - vw  * 0.25
    const maxY = MAP_H / 2 - vh  * 0.25
    const clamped = {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
    offsetRef.current = clamped
    setOffset({ ...clamped })
  }

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    didDrag.current = false
    dragInfo.current = {
      mx: e.clientX, my: e.clientY,
      ox: offsetRef.current.x, oy: offsetRef.current.y,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragInfo.current) return
    const dx = e.clientX - dragInfo.current.mx
    const dy = e.clientY - dragInfo.current.my
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true
    applyOffset(dragInfo.current.ox + dx, dragInfo.current.oy + dy)
  }, [])

  const onPointerUp = useCallback(() => {
    dragInfo.current = null
  }, [])

  // ── Reveal logic ───────────────────────────────────────────────────────────
  function isRevealed(poi: IPOI): boolean {
    if (poi.domain === 'center') return true
    const d = poi.domain as 'mind' | 'body' | 'soul' | 'creation'
    return player.domainXP[d] >= poi.revealXP
  }

  const revealPoints = POIS.filter(isRevealed).map((poi) => ({
    x: (poi.x / 100) * MAP_W,
    y: (poi.y / 100) * MAP_H,
    radius: poi.type === 'citadel' ? FOG_RADIUS_CITADEL : FOG_RADIUS_REGULAR,
  }))

  // ── POI tap ────────────────────────────────────────────────────────────────
  function handlePOITap(poi: IPOI) {
    if (didDrag.current) return
    visitPOI(poi.id)
    setSelectedPOI(poi)
  }

  const revealedCount = POIS.filter(isRevealed).length

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bottom-16 overflow-hidden bg-[#120d08] touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ cursor: dragInfo.current ? 'grabbing' : 'grab' }}
    >
      {/* ── Map world ── */}
      <div
        className="absolute"
        style={{
          width: MAP_W,
          height: MAP_H,
          left: `calc(50% + ${offset.x}px)`,
          top:  `calc(50% + ${offset.y}px)`,
          transform: 'translate(-50%, -50%)',
          userSelect: 'none',
        }}
      >
        <MapTerrain />

        {POIS.map((poi) => (
          <POIMarker
            key={poi.id}
            poi={poi}
            isRevealed={isRevealed(poi)}
            isVisited={visited.includes(poi.id)}
            onTap={handlePOITap}
          />
        ))}

        <FogCanvas
          width={MAP_W}
          height={MAP_H}
          revealPoints={revealPoints}
        />
      </div>

      {/* ── Header overlay ── */}
      <div className="absolute top-0 inset-x-0 z-20 px-4 pt-4 pb-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <h1 className="font-heading text-white text-xl italic font-bold drop-shadow">
              Mundo Interior
            </h1>
            <p className="text-white/45 text-xs mt-0.5">
              {revealedCount}/{POIS.length} locais revelados · Arraste para explorar
            </p>
          </div>
          {/* Domain legend dots */}
          <div className="flex gap-2 mt-1">
            {(['mind', 'body', 'soul', 'creation'] as const).map((d) => (
              <div
                key={d}
                className="w-2.5 h-2.5 rounded-full border border-white/20 shadow"
                style={{ background: DOMAIN_COLORS[d] }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── POI info sheet ── */}
      {selectedPOI && (
        <POISheet poi={selectedPOI} onClose={() => setSelectedPOI(null)} />
      )}
    </div>
  )
}
