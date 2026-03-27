import { useRef, useState, useCallback } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { useMapStore } from '@/stores/mapStore'
import { mapPOIs, MAP_W, MAP_H } from './mapData'
import type { POI } from './mapData'
import { FogCanvas } from './FogCanvas'
import { POIMarker } from './POIMarker'
import { POISheet } from './POISheet'
import mapBg from '@/assets/map-background.png'

const FOG_RADIUS_REGULAR = 175
const FOG_RADIUS_CITADEL = 260

const DOMAIN_COLORS: Record<string, string> = {
  mente:   '#5B8C5A',
  corpo:   '#C67B5C',
  alma:    '#6BA3B7',
  criacao: '#B8976A',
}

// Maps Portuguese domain names → playerStore domainXP keys
const DOMAIN_XP_KEY: Record<string, 'mind' | 'body' | 'soul' | 'creation'> = {
  mente:   'mind',
  corpo:   'body',
  alma:    'soul',
  criacao: 'creation',
}

export function MapPage() {
  const player   = usePlayerStore((s) => s.player)!
  const visited  = useMapStore((s) => s.visitedPOIs)
  const visitPOI = useMapStore((s) => s.visitPOI)

  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)

  // ── Pan state ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const offsetRef    = useRef({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragInfo = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)
  const didDrag  = useRef(false)

  function applyOffset(x: number, y: number) {
    const vw = containerRef.current?.clientWidth  ?? 390
    const vh = containerRef.current?.clientHeight ?? 700
    const maxX = MAP_W / 2 - vw * 0.25
    const maxY = MAP_H / 2 - vh * 0.25
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
  function isRevealed(poi: POI): boolean {
    if (poi.type === 'citadel') return true
    const xpKey = DOMAIN_XP_KEY[poi.domain]
    return player.domainXP[xpKey] >= poi.revealXP
  }

  const revealPoints = mapPOIs.filter(isRevealed).map((poi) => ({
    x: (poi.x / 100) * MAP_W,
    y: (poi.y / 100) * MAP_H,
    radius: poi.type === 'citadel' ? FOG_RADIUS_CITADEL : FOG_RADIUS_REGULAR,
  }))

  // ── POI tap ────────────────────────────────────────────────────────────────
  function handlePOITap(poi: POI) {
    if (didDrag.current) return
    visitPOI(poi.id)
    setSelectedPOI(poi)
  }

  const revealedCount = mapPOIs.filter(isRevealed).length

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bottom-16 overflow-hidden touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ background: '#3E2A12', cursor: dragInfo.current ? 'grabbing' : 'grab' }}
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
        {/* Painted watercolor background */}
        <img
          src={mapBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {mapPOIs.map((poi) => (
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
      <div className="absolute top-0 inset-x-0 z-20 px-4 pt-4 pb-6 bg-gradient-to-b from-black/55 to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <h1 className="font-heading text-white text-xl italic font-bold drop-shadow">
              Mundo Interior
            </h1>
            <p className="text-white/45 text-xs mt-0.5">
              {revealedCount}/{mapPOIs.length} locais revelados · Arraste para explorar
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            {(['mente', 'corpo', 'alma', 'criacao'] as const).map((d) => (
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
