import { useEffect, useRef } from 'react'

// Two motions, one particle engine:
//   'assemble' — chips fly in from all four edges and settle into the letters.
//                Replays every time the block scrolls back into view.
//   'drift'    — chips are already in place and glide slowly right-to-left, the
//                same airflow the page's dust field uses, on an endless loop.
export type ParticleMode = 'assemble' | 'drift'

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

type Options = {
  text: string
  mode: ParticleMode
  /** Largest font-size (px) the auto-fit is allowed to try. */
  maxFontSize: number
  /** Font-weight for the sampled mask — a touch heavier than the body serif. */
  weight: number
  /** Speed of the right-to-left glide, in px per second. */
  driftSpeed: number
}

// Warm wood browns taken from the brand palette (#b53029 → #96582c → #c5a059).
// Chips pick one at build time, so the letters read as carved timber rather than
// a flat fill.
const WOOD = ['150, 88, 44', '166, 109, 58', '194, 151, 92', '124, 74, 38']

const random = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)

// Sample the headline text into a set of target pixels using an offscreen mask,
// then give every chip an off-canvas origin so it streams in from a different edge.
function buildChips(text: string, width: number, height: number, options: Options): Chip[] {
  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const maskContext = mask.getContext('2d')
  if (!maskContext) return []

  // Fit the letters to the full width (and almost the full height) so the headline
  // spans its box from left to right instead of sitting small in the middle.
  const maxTextWidth = width * 0.98
  const fontFamily = `Georgia, 'Times New Roman', serif`
  const font = (size: number) => `${options.weight} ${size}px ${fontFamily}`
  let fontSize = Math.max(20, Math.min(options.maxFontSize, Math.round(width / 6.4)))
  maskContext.font = font(fontSize)
  // Shrink until the widest possible headline fits inside the canvas.
  while (maskContext.measureText(text).width > maxTextWidth && fontSize > 14) {
    fontSize -= 1
    maskContext.font = font(fontSize)
  }
  // ...and grow while it still fits, so the text hugs both edges.
  while (fontSize < options.maxFontSize) {
    maskContext.font = font(fontSize + 1)
    if (maskContext.measureText(text).width > maxTextWidth) break
    fontSize += 1
  }
  maskContext.font = font(fontSize)
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

  // The build is dense: at this text size the letters have to close up completely,
  // so each chip is a fine grain of the stroke rather than a visible tile.
  const chipCount = clamp(Math.round(points.length * 0.7), 2600, 16000)
  const chips: Chip[] = []
  const drift = options.mode === 'drift'
  const assemble = !drift
  for (let index = 0; index < chipCount; index += 1) {
    const [targetX, targetY] = points[Math.floor(Math.random() * points.length)]
    // Drift: every chip streams in from beyond the right edge, so the letterforms
    // stay perfectly intact while the whole word slides left. Assemble: the chips
    // are picked from all four edges, so the letters are built from every side.
    const edge = drift ? 1 : Math.floor(Math.random() * 4)
    const startX = edge === 0 ? random(-width * 0.5, -40) : edge === 1 ? random(width + 40, width * 1.5) : random(0, width)
    const startY = edge === 2 ? random(-height * 2, -40) : edge === 3 ? random(height + 40, height * 2) : random(0, height)
    chips.push({
      startX,
      startY,
      targetX,
      targetY,
      size: drift ? random(1.1, 2) : assemble ? random(1.4, 2.2) : random(1, 2.4),
      alpha: drift ? random(0.5, 0.95) : random(0.55, 0.95),
      // The build keeps its arrival window narrow so the word resolves crisply
      // instead of trailing in over a long, ragged tail.
      delay: drift ? random(0, 0.45) : random(0, 0.22),
    })
  }
  return chips
}

export function ParticleHeadline({
  text,
  className = '',
  mode = 'assemble',
  maxFontSize = 220,
  weight = 300,
  driftSpeed = 14,
}: {
  text: string
  className?: string
  mode?: ParticleMode
  maxFontSize?: number
  weight?: number
  driftSpeed?: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const drift = mode === 'drift'
    const options: Options = { text, mode, maxFontSize, weight, driftSpeed }

    let chips: Chip[] = []
    let colors: string[] = []
    let size: Size = { width: 0, height: 0, density: 1 }
    let frame = 0
    let lastTime = 0
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
      chips = buildChips(text, width, height, options)
      // One wood tone per chip, assigned once at build time so it never flickers
      // between frames.
      colors = chips.map(() => WOOD[Math.floor(Math.random() * WOOD.length)])
    }

    // The whole headline glides right-to-left. Every chip keeps its exact position
    // inside the word, so the letterforms stay perfect, and dims over a narrow band
    // at each edge: the word leaves at the left while a fresh copy arrives at the
    // right. Because both cross-fades happen in the same band, it reads as one word
    // endlessly drifting out of, and back into, the frame.
    const drawDrift = (delta: number) => {
      const shift = (clamp(delta, 0, 64) / 1000) * options.driftSpeed
      context.clearRect(0, 0, size.width, size.height)
      const fadeBand = size.width * 0.045
      for (let index = 0; index < chips.length; index += 1) {
        const chip = chips[index]
        let x = chip.targetX + shift
        // One spare copy each side, so the wrap is never visible.
        if (x > size.width) x -= size.width * 2
        if (x < -size.width) x += size.width * 2
        const fade = clamp(Math.min(x, size.width - x) / fadeBand, 0, 1)
        context.globalAlpha = chip.alpha * fade
        context.fillStyle = `rgb(${colors[index]})`
        context.fillRect(x, chip.targetY, chip.size, chip.size)
      }
      context.globalAlpha = 1
    }

    const render = (time: number) => {
      if (!chips.length) {
        frame = requestAnimationFrame(render)
        return
      }
      const delta = lastTime ? time - lastTime : 16
      lastTime = time
      if (drift) {
        if (reducedMotion) {
          // Reduced motion gets the settled letters and nothing else.
          for (let index = 0; index < chips.length; index += 1) {
            const chip = chips[index]
            context.globalAlpha = chip.alpha
            context.fillStyle = `rgb(${colors[index]})`
            context.fillRect(chip.targetX, chip.targetY, chip.size, chip.size)
          }
          context.globalAlpha = 1
          return
        }
        drawDrift(delta)
        frame = requestAnimationFrame(render)
        return
      }
      const elapsed = reducedMotion ? 1 : time - startedAt
      context.clearRect(0, 0, size.width, size.height)
      for (let index = 0; index < chips.length; index += 1) {
        const chip = chips[index]
        const progress = easeOut(clamp((elapsed / 1400) - chip.delay, 0, 1))
        const x = chip.startX + (chip.targetX - chip.startX) * progress
        const y = chip.startY + (chip.targetY - chip.startY) * progress
        context.globalAlpha = chip.alpha * Math.min(1, progress * 1.6)
        context.fillStyle = `rgb(${colors[index]})`
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
    if (drift) {
      // Keep gliding for as long as the block is mounted.
      frame = requestAnimationFrame(render)
      const handleResize = () => { lastTime = 0; resize() }
      window.addEventListener('resize', handleResize)
      return () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', handleResize)
      }
    }
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
  }, [text, mode, maxFontSize, weight, driftSpeed])

  return (
    <div ref={wrapRef} className={`particle-headline relative ${className}`} role="img" aria-label={text}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      {/* The words in real text: the headline stays available to search engines and
          to anyone browsing without canvas, without being drawn twice on screen. */}
      <span className="particle-headline__sr">{text}</span>
    </div>
  )
}
