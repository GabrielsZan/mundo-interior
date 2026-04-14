import { useRef, useState, useCallback, useEffect } from 'react'
import { useMapStore } from '@/stores/mapStore'
import { mapPOIs, MAP_W, MAP_H } from './mapData'
import type { POI } from './mapData'
import { FogCanvas } from './FogCanvas'
import { POIMarker } from './POIMarker'
import { POISheet } from './POISheet'
import { NyxosInvasionModal } from './NyxosInvasionModal'
import mapBg from '@/assets/map-background.png'

const FOG_RADIUS_REGULAR = 340
const FOG_RADIUS_CITADEL = 510

const DOMAIN_COLORS: Record<string, string> = {
  mente:   '#5B8C5A',
  corpo:   '#C67B5C',
  alma:    '#6BA3B7',
  criacao: '#B8976A',
}

export function MapPage() {
  const revealedPois        = useMapStore((s) => s.revealedPois)
  const invadedPois         = useMapStore((s) => s.invadedPois)
  const pendingInvasions    = useMapStore((s) => s.pendingInvasions)
  const checkInvasion       = useMapStore((s) => s.checkInvasion)
  const isPOIInvaded        = useMapStore((s) => s.isPOIInvaded)
  const isPOILocked         = useMapStore((s) => s.isPOILocked)

  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [showInvasionModal, setShowInvasionModal] = useState(false)

  // Run invasion check on mount
  useEffect(() => {
    checkInvasion()
  }, [checkInvasion])

  // Show modal when pending invasions appear
  useEffect(() => {
    if (pendingInvasions.length > 0) {
      setShowInvasionModal(true)
    }
  }, [pendingInvasions.length])

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

  // ── Reveal logic (store-based) ─────────────────────────────────────────────
  function isRevealed(poi: POI): boolean {
    return revealedPois.includes(poi.id)
  }

  const revealPoints = mapPOIs.filter(isRevealed).map((poi) => ({
    x:      (poi.x / 100) * MAP_W,
    y:      (poi.y / 100) * MAP_H,
    radius: poi.type === 'citadel' ? FOG_RADIUS_CITADEL : FOG_RADIUS_REGULAR,
  }))

  // ── POI tap ────────────────────────────────────────────────────────────────
  const resetDrag = useCallback(() => {
    didDrag.current = false
  }, [])

  function handlePOITap(poi: POI) {
    if (didDrag.current) return
    setSelectedPOI(poi)
  }

  const revealedCount = mapPOIs.filter(isRevealed).length

  return (
    <>
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
          width:  MAP_W,
          height: MAP_H,
          left:   `calc(50% + ${offset.x}px)`,
          top:    `calc(50% + ${offset.y}px)`,
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
            isVisited={false}
            isInvaded={isPOIInvaded(poi.id)}
            isLocked={isPOILocked(poi.id)}
            onTap={handlePOITap}
            onResetDrag={resetDrag}
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
              {revealedCount}/{mapPOIs.length} locais revelados
              {invadedPois.length > 0 && (
                <span style={{ color: '#D4A843' }}>
                  {' '}· {invadedPois.length} invadido{invadedPois.length > 1 ? 's' : ''}
                </span>
              )}
              {' '}· Arraste para explorar
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

    </div>

      {/* ── POI info sheet — OUTSIDE touch-none container ── */}
      {selectedPOI && (
        <POISheet poi={selectedPOI} onClose={() => setSelectedPOI(null)} />
      )}

      {/* ── Nyxos invasion modal — OUTSIDE touch-none container ── */}
      {showInvasionModal && pendingInvasions.length > 0 && (
        <NyxosInvasionModal onClose={() => setShowInvasionModal(false)} />
      )}
    </>
  )
}
