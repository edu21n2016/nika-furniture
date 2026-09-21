import { useEffect, useRef } from 'react'

type Chip = {
  // Where the chip starts (off-canvas), where it lands (a letter pixel), and a per-chip delay.
  startX: number
  startY: number
  targetX: number
  targetY: number
  size: number
  alpha: number
  delay: number
}

type Size = { width: number; height: number; density: number }

const random = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)

// Sample the headline text into a set of target pixels using an offscreen mask,
// then give every chip an off-canvas origin so it streams in from a different edge.
function buildChips(text: string, width: number, height: number): Chip[] {
  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const maskContext = mask.getContext('2d')
  if (!maskContext) return []

  // Fit the letters to the full width (and almost the full height) so the headline
  // spans the section from left to right instead of sitting small in the middle.
  const maxTextWidth = width * 0.98
  const fontFamily = `Georgia, 'Times New Roman', serif`
  let fontSize = Math.max(32, Math.min(220, Math.round(width / 7)))
  maskContext.font = `300 ${fontSize}px ${fontFamily}`
  // Shrink until the widest possible headline fits inside the canvas.
  while (maskContext.measureText(text).width > maxTextWidth && fontSize > 18) {
    fontSize -= 2
    maskContext.font = `300 ${fontSize}px ${fontFamily}`
  }
  // ...and grow while it still fits, so the text hugs both edges.
  while (fontSize < 300) {
    maskContext.font = `300 ${fontSize + 2}px ${fontFamily}`
    if (maskContext.measureText(text).width > maxTextWidth) break
    fontSize += 2
  }
  maskContext.font = `300 ${fontSize}px ${fontFamily}`
  maskContext.fillStyle = '#000'
  maskContext.textAlign = 'center'
  maskContext.textBaseline = 'middle'
  maskContext.fillText(text, width / 2, height / 2)

  const imageData = maskContext.getImageData(0, 0, width, height).data
  const points: Array<[number, number]> = []
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (imageData[(y * width + x) * 4 + 3] > 120) points.push([x, y])
    }
  }
  if (!points.length) return []

  const chipCount = clamp(Math.round(points.length * 0.34), 1400, 9000)
  const chips: Chip[] = []
  for (let index = 0; index < chipCount; index += 1) {
    const [targetX, targetY] = points[Math.floor(Math.random() * points.length)]
    // Pick one of the four edges so the letters are assembled from several directions.
    const edge = Math.floor(Math.random() * 4)
    const startX = edge === 0 ? random(-width * 0.5, -40) : edge === 1 ? random(width + 40, width * 1.5) : random(0, width)
    const startY = edge === 2 ? random(-height * 2, -40) : edge === 3 ? random(height + 40, height * 2) : random(0, height)
    chips.push({
      startX,
      startY,
      targetX,
      targetY,
      size: random(1, 2.4),
      alpha: random(0.55, 0.95),
      delay: random(0, 0.45),
    })
  }
  return chips
}

export function ParticleHeadline({ text, className = '' }: { text: string; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let chips: Chip[] = []
    let size: Size = { width: 0, height: 0, density: 1 }
    let frame = 0
    let startedAt = performance.now()
    let building = false // true while the chips are flying in and assembling the text.

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      const density = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * density)
      canvas.height = Math.round(height * density)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(density, 0, 0, density, 0, 0)
      size = { width, height, density }
      chips = buildChips(text, width, height)
    }

    const render = (time: number) => {
      if (document.hidden || !chips.length) {
        frame = requestAnimationFrame(render)
        return
      }
      const elapsed = reducedMotion ? 1 : time - startedAt
      context.clearRect(0, 0, size.width, size.height)
      for (const chip of chips) {
        const progress = easeOut(clamp((elapsed / 1400) - chip.delay, 0, 1))
        const x = chip.startX + (chip.targetX - chip.startX) * progress
        const y = chip.startY + (chip.targetY - chip.startY) * progress
        context.globalAlpha = chip.alpha * Math.min(1, progress * 1.6)
        context.fillStyle = 'rgb(150, 88, 44)'
        context.fillRect(x, y, chip.size, chip.size)
      }
      context.globalAlpha = 1
      // Stop looping once the text is fully settled and held in place.
      if (elapsed > 2000) {
        building = false
        return
      }
      frame = requestAnimationFrame(render)
    }

    resize()
    if (!reducedMotion) {
      // Replay the build every time the section scrolls back into view: clearing the
      // canvas when it leaves, then re-firing the chips when it returns.
      const start = () => {
        context.clearRect(0, 0, size.width, size.height)
        startedAt = performance.now()
        if (!building) {
          building = true
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(render)
        }
      }
      const stop = () => {
        building = false
        cancelAnimationFrame(frame)
        frame = 0
        context.clearRect(0, 0, size.width, size.height)
      }
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start()
          else stop()
        }
      }, { threshold: 0.3 })
      observer.observe(wrap)
      const handleResize = () => {
        resize()
        if (building) startedAt = performance.now()
      }
      window.addEventListener('resize', handleResize)
      return () => {
        observer.disconnect()
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', handleResize)
      }
    }
    // Reduced motion: draw the settled text once, no animation.
    render(performance.now())
    return undefined
  }, [text])

  return (
    <div ref={wrapRef} className={`relative ${className}`} aria-label={text}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </div>
  )
}
