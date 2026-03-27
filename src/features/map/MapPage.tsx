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
      style={{ background: '#E8D5A0' }}
    >
      {/* Region labels — ink style */}
      <span
        className="absolute top-3 left-1/2 -translate-x-1/2 font-heading italic"
        style={{ color: '#2A2118', opacity: 0.28, fontSize: '11px', letterSpacing: '0.18em', textShadow: '0 1px 0 rgba(232,213,160,0.8)' }}
      >
        Norte · Mente
      </span>
      <span
        className="absolute bottom-3 left-1/2 -translate-x-1/2 font-heading italic"
        style={{ color: '#2A2118', opacity: 0.28, fontSize: '11px', letterSpacing: '0.18em', textShadow: '0 1px 0 rgba(232,213,160,0.8)' }}
      >
        Sul · Corpo
      </span>
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 font-heading italic"
        style={{ color: '#2A2118', opacity: 0.28, fontSize: '11px', letterSpacing: '0.18em', writingMode: 'vertical-rl', textShadow: '0 1px 0 rgba(232,213,160,0.8)' }}
      >
        Leste · Alma
      </span>
      <span
        className="absolute left-3 top-1/2 font-heading italic"
        style={{ color: '#2A2118', opacity: 0.28, fontSize: '11px', letterSpacing: '0.18em', writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)', textShadow: '0 1px 0 rgba(232,213,160,0.8)' }}
      >
        Oeste · Criação
      </span>

      {/* SVG terrain */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Paper grain filter */}
          <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
            <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
          </filter>
        </defs>

        {/* Parchment base with grain */}
        <rect width={MAP_W} height={MAP_H} fill="#E8D5A0" filter="url(#paper-grain)" />

        {/* ── Region area fills ────────────────────────────────────────────── */}

        {/* North / Mind — cool sage wash */}
        <path
          d="M 0 0 L 1600 0 L 1600 300 Q 1300 370 800 350 Q 400 360 0 300 Z"
          fill="#C8D9C4" opacity="0.42"
        />
        {/* South / Body — warm terracotta wash */}
        <path
          d="M 0 900 L 1600 900 L 1600 590 Q 1200 540 800 560 Q 380 540 0 590 Z"
          fill="#E8C4A8" opacity="0.38"
        />
        {/* East / Soul — aqua wash */}
        <path
          d="M 1600 0 L 1600 900 L 1140 900 Q 1095 620 1110 450 Q 1095 260 1140 0 Z"
          fill="#AECFDB" opacity="0.38"
        />
        {/* West / Creation — forest wash */}
        <path
          d="M 0 0 L 430 0 Q 388 260 395 450 Q 388 660 430 900 L 0 900 Z"
          fill="#D4C8A0" opacity="0.38"
        />

        {/* ── Region dividers (dashed ink lines) ───────────────────────────── */}
        <path d="M 0 300 Q 400 360 800 350 Q 1200 370 1600 300"
          stroke="#2A2118" strokeWidth="0.8" strokeDasharray="6 9" fill="none" opacity="0.14" />
        <path d="M 0 590 Q 380 540 800 560 Q 1200 540 1600 590"
          stroke="#2A2118" strokeWidth="0.8" strokeDasharray="6 9" fill="none" opacity="0.14" />
        <path d="M 430 0 Q 388 260 395 450 Q 388 660 430 900"
          stroke="#2A2118" strokeWidth="0.8" strokeDasharray="6 9" fill="none" opacity="0.14" />
        <path d="M 1140 0 Q 1095 260 1110 450 Q 1095 660 1140 900"
          stroke="#2A2118" strokeWidth="0.8" strokeDasharray="6 9" fill="none" opacity="0.14" />

        {/* ── Mountains — North (classic ink triangles with snow hatch) ──────── */}
        <g stroke="#3D2E1A" strokeWidth="1.8" fill="none" strokeLinecap="round">
          {/* Peak cluster near mind-tower (x≈672, y≈117) */}
          <path d="M 600 215 L 655 128 L 710 215" />
          <path d="M 628 172 L 682 172" strokeWidth="1" opacity="0.45" />
          <path d="M 680 225 L 748 118 L 816 225" strokeWidth="2.2" />
          <path d="M 710 162 L 786 162" strokeWidth="1.1" opacity="0.45" />
          <path d="M 520 230 L 565 158 L 610 230" strokeWidth="1.5" />
          {/* Second cluster near observatory (x≈992, y≈72) */}
          <path d="M 945 220 L 1000 128 L 1055 220" strokeWidth="1.8" />
          <path d="M 968 170 L 1032 170" strokeWidth="1" opacity="0.45" />
          <path d="M 1040 235 L 1082 172 L 1124 235" strokeWidth="1.5" />
          <path d="M 430 245 L 468 188 L 506 245" strokeWidth="1.4" />
        </g>

        {/* ── Forest — West (classic pine symbols: triangle crown + trunk) ──── */}
        <g stroke="#3A5C38" strokeWidth="1.5" strokeLinecap="round">
          {[
            [130,350],[162,332],[198,354],[112,415],[148,430],[188,412],
            [122,490],[158,506],[202,478],[107,568],[162,552],[215,576],
            [138,640],[185,622],
          ].map(([tx, ty], i) => (
            <g key={i}>
              <path d={`M ${tx} ${ty} L ${tx} ${ty - 14}`} />
              <path d={`M ${tx - 13} ${ty} L ${tx} ${ty - 22} L ${tx + 13} ${ty} Z`}
                fill="rgba(80,110,60,0.20)" />
            </g>
          ))}
        </g>

        {/* ── River — East (3 parallel wavy lines, decreasing opacity) ──────── */}
        <path d="M 1600 355 Q 1440 368 1340 383 Q 1190 400 1040 422 Q 940 436 840 448"
          stroke="#4A7D93" strokeWidth="3.5" fill="none" opacity="0.52" strokeLinecap="round" />
        <path d="M 1600 365 Q 1440 378 1340 393 Q 1190 410 1040 430 Q 940 444 840 456"
          stroke="#6BA3B7" strokeWidth="2" fill="none" opacity="0.32" strokeLinecap="round" />
        <path d="M 1600 374 Q 1440 386 1340 401 Q 1190 418 1040 438 Q 940 451 840 463"
          stroke="#96C3D3" strokeWidth="1.2" fill="none" opacity="0.22" strokeLinecap="round" />

        {/* ── Lake — East near soul-lake POI (x≈1328, y≈333) ──────────────── */}
        <ellipse cx="1330" cy="333" rx="62" ry="38"
          fill="#6BA3B7" opacity="0.20" stroke="#4A7D93" strokeWidth="1.2" />
        <path d="M 1279 325 Q 1330 321 1381 325" stroke="#4A7D93" strokeWidth="0.8" fill="none" opacity="0.32" />
        <path d="M 1273 334 Q 1330 330 1387 334" stroke="#4A7D93" strokeWidth="0.8" fill="none" opacity="0.32" />
        <path d="M 1279 343 Q 1330 339 1381 343" stroke="#4A7D93" strokeWidth="0.8" fill="none" opacity="0.32" />

        {/* ── Plains — South (short diagonal hatch groups) ─────────────────── */}
        <g stroke="#8A5A3A" strokeWidth="1" opacity="0.18" strokeLinecap="round">
          {[200,260,320,380,440,500,560,620,700,780,860,940,1020,1100,1180,1260,1340].map((bx, i) => (
            <g key={i}>
              <path d={`M ${bx} ${695 + (i % 2) * 12} L ${bx + 10} ${712 + (i % 2) * 12}`} />
              <path d={`M ${bx + 18} ${698 + (i % 2) * 12} L ${bx + 28} ${715 + (i % 2) * 12}`} />
              <path d={`M ${bx + 36} ${693 + (i % 3) * 8} L ${bx + 46} ${710 + (i % 3) * 8}`} />
            </g>
          ))}
        </g>

        {/* ── Citadel rings (gold concentric) ──────────────────────────────── */}
        <circle cx={MAP_W / 2} cy={MAP_H / 2} r={92}
          fill="rgba(212,168,67,0.06)" stroke="#D4A843" strokeWidth="1.2" opacity="0.48" />
        <circle cx={MAP_W / 2} cy={MAP_H / 2} r={118}
          fill="none" stroke="#D4A843" strokeWidth="0.8" strokeDasharray="4 7" opacity="0.32" />
        {/* 8 radial tick marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const cx = MAP_W / 2, cy = MAP_H / 2
          const x1 = cx + Math.cos(rad) * 96, y1 = cy + Math.sin(rad) * 96
          const x2 = cx + Math.cos(rad) * 112, y2 = cy + Math.sin(rad) * 112
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#D4A843" strokeWidth="1.4" opacity="0.45" />
        })}

        {/* ── Map border (double-line ink frame) ───────────────────────────── */}
        <rect x="10" y="10" width={MAP_W - 20} height={MAP_H - 20} rx="3"
          fill="none" stroke="#2A2118" strokeWidth="2" opacity="0.30" />
        <rect x="18" y="18" width={MAP_W - 36} height={MAP_H - 36} rx="2"
          fill="none" stroke="#2A2118" strokeWidth="0.9" opacity="0.16" />

        {/* ── Compass rose — bottom right corner ───────────────────────────── */}
        <g transform="translate(1525, 845)">
          {/* N (solid ink) */}
          <path d="M 0 -26 L 5 -9 L 0 -4 L -5 -9 Z" fill="#2A2118" opacity="0.65" />
          {/* S (parchment with ink border) */}
          <path d="M 0 26 L 5 9 L 0 4 L -5 9 Z" fill="#E8D5A0" stroke="#2A2118" strokeWidth="0.8" opacity="0.65" />
          {/* E */}
          <path d="M 26 0 L 9 5 L 4 0 L 9 -5 Z" fill="#E8D5A0" stroke="#2A2118" strokeWidth="0.8" opacity="0.65" />
          {/* W */}
          <path d="M -26 0 L -9 5 L -4 0 L -9 -5 Z" fill="#E8D5A0" stroke="#2A2118" strokeWidth="0.8" opacity="0.65" />
          {/* Center dot — gold */}
          <circle r="3" fill="#D4A843" opacity="0.85" />
          {/* N label */}
          <text x="0" y="-30" textAnchor="middle" fontSize="8"
            fontFamily="Lora, Georgia, serif" fontStyle="italic" fill="#2A2118" opacity="0.55">N</text>
        </g>
      </svg>

      {/* Vignette — darkens edges without touching center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 88% 82% at 50% 50%, transparent 52%, rgba(90,60,20,0.32) 100%)',
        }}
      />
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
      <div className="absolute top-0 inset-x-0 z-20 px-4 pt-4 pb-6 bg-gradient-to-b from-black/55 to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto flex items-start justify-between">
          <div>
            <h1 className="font-heading text-white text-xl italic font-bold drop-shadow">
              Mundo Interior
            </h1>
            <p className="text-white/45 text-xs mt-0.5">
              {revealedCount}/{POIS.length} locais revelados · Arraste para explorar
            </p>
          </div>
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
