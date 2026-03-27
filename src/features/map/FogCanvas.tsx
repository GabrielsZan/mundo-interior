import { useEffect, useRef } from 'react'

interface RevealPoint {
  x: number      // pixels on the map
  y: number
  radius: number
}

interface FogCanvasProps {
  width: number
  height: number
  revealPoints: RevealPoint[]
}

export function FogCanvas({ width, height, revealPoints }: FogCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, width, height)

    // Pass 1: warm sepia fog base
    ctx.fillStyle = 'rgba(62, 42, 18, 0.72)'
    ctx.fillRect(0, 0, width, height)

    // Pass 2: depth layer (multiply gives parchment-over-fog warmth)
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(90, 75, 55, 0.30)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'

    // Punch soft holes for each revealed POI
    ctx.globalCompositeOperation = 'destination-out'
    for (const pt of revealPoints) {
      const grad = ctx.createRadialGradient(
        pt.x, pt.y, pt.radius * 0.10,
        pt.x, pt.y, pt.radius
      )
      // Broad feather zone: transition from 0.40 → 1.0 (60% of radius)
      grad.addColorStop(0,    'rgba(0,0,0,1)')
      grad.addColorStop(0.40, 'rgba(0,0,0,0.95)')
      grad.addColorStop(0.65, 'rgba(0,0,0,0.70)')
      grad.addColorStop(0.82, 'rgba(0,0,0,0.35)')
      grad.addColorStop(0.94, 'rgba(0,0,0,0.10)')
      grad.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Warm ink halo at fog boundary (mist bleeding effect)
    ctx.globalCompositeOperation = 'source-over'
    for (const pt of revealPoints) {
      const ring = ctx.createRadialGradient(
        pt.x, pt.y, pt.radius * 0.88,
        pt.x, pt.y, pt.radius * 1.06
      )
      ring.addColorStop(0,   'rgba(90, 60, 20, 0)')
      ring.addColorStop(0.5, 'rgba(90, 60, 20, 0.12)')
      ring.addColorStop(1,   'rgba(90, 60, 20, 0)')
      ctx.fillStyle = ring
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pt.radius * 1.06, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [width, height, revealPoints])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
