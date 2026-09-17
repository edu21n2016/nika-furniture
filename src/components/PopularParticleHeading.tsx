import { useEffect, useRef, useState } from 'react'

type Particle = {
  startX: number
  startY: number
  targetX: number
  targetY: number
  size: number
  rotation: number
  spin: number
  tone: string
}

const woodTones = ['#2c1d11', '#422817', '#5c3a21', '#8c5a2b']
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)

/**
 * Samples a text mask into small targets. Each target receives an off-canvas
 * starting point so the animation reads as wood shavings assembling the title.
 */
function makeParticles(width: number, height: number) {
  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const context = mask.getContext('2d')!
  const compact = width < 600
  const size = compact ? Math.max(42, Math.round(width * .13)) : Math.max(68, Math.min(128, Math.round(width * .08)))
  const lineGap = compact ? size * .9 : size * .84

  context.fillStyle = '#000'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = `700 ${size}px Georgia, 'Times New Roman', serif`
  context.fillText('MOST POPULAR', width / 2, height / 2 - lineGap * .43)
  context.font = `italic 700 ${size}px Georgia, 'Times New Roman', serif`
  context.fillText('FURNITURE', width / 2, height / 2 + lineGap * .48)

  const pixels = context.getImageData(0, 0, width, height).data
  // Two-pixel sampling keeps each serif edge dense enough to read as type.
  const step = 2
  const targets: Array<[number, number]> = []
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (pixels[(y * width + x) * 4 + 3] > 150 && Math.random() > .12) targets.push([x, y])
    }
  }

  const maximum = compact ? 2800 : 5000
  const selected = targets.length > maximum
    ? Array.from({ length: maximum }, () => targets[Math.floor(Math.random() * targets.length)])
    : targets

  return selected.map(([targetX, targetY]): Particle => {
    // A radial launch puts every shaving well beyond the canvas edge, rather
    // than letting it appear in place or from a single direction.
    const angle = Math.random() * Math.PI * 2
    const distance = Math.max(width, height) * (1.12 + Math.random() * .72)
    const startX = targetX + Math.cos(angle) * distance
    const startY = targetY + Math.sin(angle) * distance
    return { startX, startY, targetX, targetY, size: .85 + Math.random() * 1.8, rotation: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * 13, tone: woodTones[Math.floor(Math.random() * woodTones.length)] }
  })
}

export function PopularParticleHeading() {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return undefined
    let observer: IntersectionObserver | undefined
    let frame = 0
    let playing = false

    const play = () => {
      if (playing) return
      playing = true
      const bounds = host.getBoundingClientRect()
      const width = Math.max(280, Math.round(bounds.width))
      const height = width < 600 ? Math.round(Math.min(270, Math.max(210, width * .3))) : 288
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.height = `${height}px`
      const context = canvas.getContext('2d')!
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const particles = makeParticles(width, height)
      const startedAt = performance.now()
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1750

      const draw = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        const eased = easeOutCubic(progress)
        context.clearRect(0, 0, width, height)
        for (const particle of particles) {
          const x = particle.startX + (particle.targetX - particle.startX) * eased
          const y = particle.startY + (particle.targetY - particle.startY) * eased
          context.save()
          context.translate(x, y)
          context.rotate(particle.rotation + particle.spin * (1 - eased) * (1 - eased))
          context.globalAlpha = Math.min(1, progress * 2.4)
          context.fillStyle = particle.tone
          // Small rectangles produce wood chips rather than snow-like circles.
          context.fillRect(-particle.size * 1.4, -particle.size / 2, particle.size * 2.8, particle.size)
          context.restore()
        }
        if (progress < 1) frame = requestAnimationFrame(draw)
        else {
          playing = false
          setComplete(true)
        }
      }
      frame = requestAnimationFrame(draw)
    }

    const reset = () => {
      playing = false
      cancelAnimationFrame(frame)
      const context = canvas.getContext('2d')
      if (context) context.clearRect(0, 0, canvas.width, canvas.height)
      setComplete(false)
    }

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        play()
      } else reset()
    }, { threshold: .25 })
    observer.observe(host)
    return () => {
      observer?.disconnect()
      reset()
    }
  }, [])

  return <div ref={hostRef} className="particle-heading" aria-label="Most Popular Furniture">
    <canvas ref={canvasRef} aria-hidden="true" />
    <p className={complete ? 'is-visible' : ''}>A curated selection of signature pieces.</p>
  </div>
}
