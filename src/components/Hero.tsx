import { useEffect, useRef, useState } from 'react'
import { heroSlides } from '../data/furniture'
import type { TranslationSet } from '../types/furniture'
import { ImageWithFallback } from './ImageWithFallback'

export function Hero({ t }: { t: TranslationSet }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const interactionTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const slide = heroSlides[activeIndex]

  useEffect(() => () => window.clearTimeout(interactionTimeout.current), [])

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % heroSlides.length), 6500)
    return () => window.clearInterval(timer)
  }, [isPaused])

  const moveTo = (index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length)
    setIsPaused(true)
    window.clearTimeout(interactionTimeout.current)
    interactionTimeout.current = window.setTimeout(() => setIsPaused(false), 7000)
  }

  return (
    <section className="hero" id="home" aria-labelledby="hero-title" aria-roledescription="carousel" aria-label="NIKA furniture showcase">
      <div className="hero-image-stage" aria-live="polite">
        <ImageWithFallback key={slide.id} className="hero-image" src={slide.image} alt={slide.alt} />
      </div>
      <div className="hero-shade" />
      <div className="hero-topline page-shell"><span>01 / NIKA SHOWROOM</span><span>Furniture &amp; wood work</span></div>
      <div className="hero-content page-shell" key={`${slide.id}-${activeIndex}`}>
        <p className="eyebrow hero-reveal">{slide.eyebrow}</p>
        <h1 className="hero-reveal" id="hero-title">{activeIndex === 0 ? t.hero.title : slide.title}</h1>
        <p className="hero-description hero-reveal">{activeIndex === 0 ? t.hero.description : slide.description}</p>
        <div className="hero-actions hero-reveal">
          <a className="button button-light" href="#furniture">{t.hero.primary} <span aria-hidden="true">↘</span></a>
          <a className="text-link light-link" href="#contact">{t.hero.secondary} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="hero-controls page-shell">
        <span className="hero-count">{String(activeIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
        <div className="hero-dots" aria-label="Hero slides">
          {heroSlides.map((item, index) => <button className={index === activeIndex ? 'is-active' : ''} key={item.id} onClick={() => moveTo(index)} aria-label={`Show slide ${index + 1}`} aria-pressed={index === activeIndex} />)}
        </div>
        <div className="hero-arrows">
          <button onClick={() => moveTo(activeIndex - 1)} aria-label="Previous hero slide">←</button>
          <button onClick={() => moveTo(activeIndex + 1)} aria-label="Next hero slide">→</button>
        </div>
      </div>
      <a className="scroll-cue" href="#furniture" aria-label="Scroll to selected furniture"><span>Scroll to explore</span><i>↓</i></a>
    </section>
  )
}