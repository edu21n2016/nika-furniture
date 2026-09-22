import { useEffect, useRef } from 'react'

type BackgroundDust = { x: number; y: number; speed: number; size: number; length: number; alpha: number; wave: number; phase: number; color: string }
type LogoDust = { startX: number; startY: number; targetX: number; targetY: number; outX: number; outY: number; size: number; alpha: number }

const random = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)

function makeBackgroundParticle(width: number, height: number, fresh = false): BackgroundDust {
  const depth = Math.random()
  return {
    // The continuous field is born at the right and always travels to the left.
    // A right-edge source band is always populated; this is never allowed to run empty.
    x: fresh ? width - Math.pow(Math.random(), 5.2) * width * .56 : random(width - 3, width + 5),
    y: random(0, height),
    speed: random(.34, 1.04) * (depth > .72 ? 1.28 : 1),
    size: depth > .9 ? random(1.8, 3) : depth > .48 ? random(1, 1.9) : random(.62, 1.16),
    length: depth > .76 ? random(2, 4.8) : random(.7, 2.6),
    alpha: depth > .85 ? random(.58, .78) : depth > .42 ? random(.34, .60) : random(.18, .38),    wave: random(8, 36),
    phase: random(0, Math.PI * 2),
    color: depth > .88 ? '130, 72, 42' : depth > .56 ? '166, 109, 58' : '194, 151, 92',
  }
}

function makeLogoParticles(width: number, height: number): LogoDust[] {
  const logoWidth = Math.min(width * .48, 300)
  const logoHeight = logoWidth * .76
  const logoX = width / 2 - logoWidth / 2
  const logoY = height / 2 - logoHeight / 2 - height * .075
  const particles: LogoDust[] = []

  const fromEdge = (targetX: number, targetY: number, size = random(.7, 2.1), alpha = random(.36, .76)) => {
    const edge = Math.floor(Math.random() * 4)
    const startX = edge === 0 ? random(-150, -20) : edge === 1 ? random(width + 20, width + 150) : random(0, width)
    const startY = edge === 2 ? random(-150, -20) : edge === 3 ? random(height + 20, height + 150) : random(0, height)
    const angle = Math.atan2(targetY - height / 2, targetX - width / 2) + random(-.7, .7)
    particles.push({
      startX, startY, targetX, targetY,
      outX: targetX + Math.cos(angle) * random(width * .42, width * .82),
      outY: targetY + Math.sin(angle) * random(height * .42, height * .82),
      size, alpha,
    })
  }

  // A fine halo gathers around the mark but leaves its silhouette unobstructed.
  const haloCount = Math.min(950, Math.max(520, Math.round(width * .62)))
  for (let index = 0; index < haloCount; index += 1) {
    let targetX = 0
    let targetY = 0
    do {
      targetX = width / 2 + random(-logoWidth * 1.24, logoWidth * 1.24)
      targetY = height / 2 - height * .075 + random(-logoHeight * 1.52, logoHeight * 1.52)
    } while (targetX > logoX - 18 && targetX < logoX + logoWidth + 18 && targetY > logoY - 18 && targetY < logoY + logoHeight + 18)
    fromEdge(targetX, targetY)
  }

  // The company line is a dense, sampled particle mask—not regular rendered text.
  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const maskContext = mask.getContext('2d')!
  const textSize = Math.max(20, Math.min(46, Math.round(width / 25)))
  const textY = logoY + logoHeight + textSize * 1.05
  maskContext.fillStyle = '#000'
  maskContext.textAlign = 'center'
  maskContext.textBaseline = 'middle'
  maskContext.font = `900 ${textSize}px Arial Black, Arial, sans-serif`
  maskContext.fillText('FURNITURES AND WOOD WORK', width / 2, textY)
  const imageData = maskContext.getImageData(0, 0, width, height).data
  const points: Array<[number, number]> = []
  for (let y = Math.max(0, Math.floor(textY - textSize)); y < Math.min(height, Math.ceil(textY + textSize)); y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (imageData[(y * width + x) * 4 + 3] > 120) points.push([x, y])
    }
  }
  const textParticleCount = Math.min(4200, Math.max(1800, points.length * 1.4))
  for (let index = 0; index < textParticleCount; index += 1) {
    const [targetX, targetY] = points[Math.floor(Math.random() * points.length)]
    fromEdge(targetX, targetY, random(.8, 1.7), random(.60, .94))
  }

  return particles
}

type SceneSize = { width: number; height: number; density: number }

type Scene = {
  context: CanvasRenderingContext2D
  size: SceneSize
  background: BackgroundDust[]
  logoParticles: LogoDust[]
  logoImage: HTMLImageElement
  reducedMotion: boolean
  startedAt: number
}

function resizeScene(scene: Scene, canvas: HTMLCanvasElement) {
  const width = window.innerWidth
  const height = window.innerHeight
  const density = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.round(width * density)
  canvas.height = Math.round(height * density)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  scene.context.setTransform(density, 0, 0, density, 0, 0)
  scene.size = { width, height, density }
  const count = width < 720 ? 3200 : 5600
  scene.background = Array.from({ length: count }, () => makeBackgroundParticle(width, height, true))
  if (scene.logoImage.complete && scene.logoImage.naturalWidth) scene.logoParticles = makeLogoParticles(width, height)
}

function drawBackground(scene: Scene, time: number) {
  const { context } = scene
  const { width, height } = scene.size
  // The field sits one level back from the content. Individually the chips are
  // rendered faint enough that no single one competes with the typography; the
  // number of chips is what makes the dust read as a moving surface, not how bold
  // each one is. Raise this toward 1 if the dust ever needs to come forward.
  const DEPTH = 0.62
  for (const particle of scene.background) {
    particle.x -= particle.speed
    particle.y += Math.sin(time * .00042 + particle.phase) * .16
    // Immediate re-entry at the right maintains one unbroken right-to-left airflow.
    if (particle.x < -24) Object.assign(particle, makeBackgroundParticle(width, height))
    // Full presence at the right; a measured fade begins near centre and continues left.
    const leftProgress = clamp(particle.x / (width * .35), 0, 1)
    const fade = particle.x < width * .35 ? .18 + leftProgress * .82 : 1
    context.globalAlpha = particle.alpha * fade * DEPTH
    context.fillStyle = `rgb(${particle.color})`
    context.save()
    context.translate(particle.x, particle.y + Math.sin(time * .0007 + particle.phase) * particle.wave)
    context.rotate(Math.sin(time * .00055 + particle.phase) * .35)
    context.fillRect(-particle.length / 2, -particle.size / 2, particle.length, particle.size)
    context.restore()
  }
}

function drawLogo(scene: Scene, elapsed: number) {
  const { context, logoImage, reducedMotion } = scene
  const { width, height } = scene.size
  const gatherDuration = reducedMotion ? 1 : 2500
  const holdDuration = reducedMotion ? 350 : 2200
  const breakDuration = reducedMotion ? 1 : 1050
  const total = gatherDuration + holdDuration + breakDuration
  if (elapsed > total) return
  const gather = clamp(elapsed / gatherDuration, 0, 1)
  const holdEnd = gatherDuration + holdDuration
  const breaking = elapsed > holdEnd ? clamp((elapsed - holdEnd) / breakDuration, 0, 1) : 0
  for (const particle of scene.logoParticles) {
    let x: number
    let y: number
    let alpha: number
    if (breaking > 0) {
      x = particle.targetX + (particle.outX - particle.targetX) * easeOut(breaking)
      y = particle.targetY + (particle.outY - particle.targetY) * easeOut(breaking)
      alpha = particle.alpha * (1 - breaking)
    } else {
      const progress = easeOut(gather)
      x = particle.startX + (particle.targetX - particle.startX) * progress
      y = particle.startY + (particle.targetY - particle.startY) * progress
      alpha = particle.alpha * Math.min(1, gather * 1.7)
    }
    context.globalAlpha = alpha
    context.fillStyle = 'rgb(166, 42, 36)'
    context.fillRect(x, y, particle.size, particle.size)
  }

  // The actual asset is always crisp; dust only frames it during the entrance.
  const logoWidth = Math.min(width * .48, 300)
  const logoHeight = logoWidth * .76
  const logoX = width / 2 - logoWidth / 2
  const logoY = height / 2 - logoHeight / 2 - height * .075
  const logoOpacity = breaking > 0 ? 1 - breaking : Math.min(1, easeOut(gather) * 1.3)
  context.globalAlpha = logoOpacity
  context.drawImage(logoImage, 0, 0, logoImage.naturalWidth, logoImage.naturalHeight * .70, logoX, logoY, logoWidth, logoHeight)
}

export function ParticleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const logoImage = new Image()
    const scene: Scene = {
      context,
      size: { width: 0, height: 0, density: 1 },
      background: [],
      logoParticles: [],
      logoImage,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      startedAt: performance.now(),
    }
    let frame = 0
    const handleResize = () => {
      resizeScene(scene, canvas)
      if (logoImage.complete && logoImage.naturalWidth) {
        scene.logoParticles = makeLogoParticles(scene.size.width, scene.size.height)
      }
    }

    const render = (time: number) => {
      frame = requestAnimationFrame(render)
      if (document.hidden) return
      const { context: draw, size, reducedMotion, startedAt } = scene
      draw.clearRect(0, 0, size.width, size.height)
      const elapsed = time - startedAt
      const backgroundStart = reducedMotion ? 700 : 6400
      if (elapsed < backgroundStart) drawLogo(scene, elapsed)
      else drawBackground(scene, time)
      draw.globalAlpha = 1
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (!frame) {
        scene.startedAt = performance.now()
        frame = requestAnimationFrame(render)
      }
    }

    logoImage.onload = () => {
      scene.logoParticles = makeLogoParticles(scene.size.width, scene.size.height)
      scene.startedAt = performance.now()
    }
    logoImage.src = '/images/nika-logo.png'
    handleResize()
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibility)
    if (!document.hidden) frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return <canvas id="particle-canvas" className="particle-scene" ref={canvasRef} aria-hidden="true" />
}
