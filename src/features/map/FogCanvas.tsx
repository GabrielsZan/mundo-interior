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

    // Dark fog layer
    ctx.fillStyle = 'rgba(10, 6, 3, 0.84)'
    ctx.fillRect(0, 0, width, height)

    // Punch holes for each revealed POI
    ctx.globalCompositeOperation = 'destination-out'
    for (const pt of revealPoints) {
      const grad = ctx.createRadialGradient(pt.x, pt.y, pt.radius * 0.15, pt.x, pt.y, pt.radius)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(0.55, 'rgba(0,0,0,0.9)')
      grad.addColorStop(0.85, 'rgba(0,0,0,0.4)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
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
