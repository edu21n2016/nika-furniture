import { useEffect, useRef, useState } from 'react'
import { furnitureItems } from '../data/furniture'
import type { TranslationSet } from '../types/furniture'
import { ImageWithFallback } from './ImageWithFallback'

export function SelectedFurniture({ t }: { t: TranslationSet }) {
  const items = furnitureItems
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const interactionTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const touchStart = useRef<number | null>(null)
  const activeItem = items[activeIndex]

  useEffect(() => () => window.clearTimeout(interactionTimeout.current), [])

  useEffect(() => {
    if (isPaused || lightboxOpen) return undefined
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % items.length), 5600)
    return () => window.clearInterval(timer)
  }, [isPaused, lightboxOpen, items.length])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowRight') moveTo(activeIndex + 1)
      if (event.key === 'ArrowLeft') moveTo(activeIndex - 1)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeIndex])

  const moveTo = (index: number) => {
    setActiveIndex((index + items.length) % items.length)
    setIsPaused(true)
    window.clearTimeout(interactionTimeout.current)
    interactionTimeout.current = window.setTimeout(() => setIsPaused(false), 6000)
  }

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = event.touches[0].clientX
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) moveTo(activeIndex + (distance < 0 ? 1 : -1))
    touchStart.current = null
  }

  const openLightbox = () => setLightboxOpen(true)
  const closeLightbox = () => setLightboxOpen(false)

  return (
    <section className="selected-section section-reveal" id="furniture">
      <div className="page-shell">
        <div className="selected-heading">
          <div>
            <p className="eyebrow">{t.selected.eyebrow}</p>
            <h2>{t.selected.title}</h2>
          </div>
          <p>{t.selected.description}</p>
        </div>

        <div className="selected-gallery" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button className="selected-image-button" onClick={openLightbox} aria-label={`${t.selected.open}: ${activeItem.title}`}>
            <ImageWithFallback key={activeItem.id} src={activeItem.image} alt={activeItem.alt} style={{ objectPosition: activeItem.backgroundPosition ?? 'center' }} />
            <span className="selected-image-hint">{t.selected.open} <span aria-hidden="true">↗</span></span>
          </button>

          <div className="selected-info">
            <div>
              <p className="item-kicker">{activeItem.category}</p>
              <h3>{activeItem.title}</h3>
              <p>{activeItem.description}</p>
            </div>
            <a className="text-link" href="#contact">{t.selected.viewDetails} <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="selected-controls">
          <div className="selected-arrows">
            <button onClick={() => moveTo(activeIndex - 1)} aria-label={t.selected.previous}>←</button>
            <button onClick={() => moveTo(activeIndex + 1)} aria-label={t.selected.next}>→</button>
          </div>

          <div className="selected-dots" aria-label="Selected furniture items">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => moveTo(index)}
                aria-label={`Show ${item.title}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>

          <span className="selected-count">{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        </div>
      </div>

      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeItem.title} onClick={closeLightbox}>
          <div className="lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label={t.selected.close}>×</button>
            <ImageWithFallback src={activeItem.image} alt={activeItem.alt} style={{ objectPosition: activeItem.backgroundPosition ?? 'center' }} />
            <div className="lightbox-caption">
              <p className="item-kicker">{activeItem.category}</p>
              <h3>{activeItem.title}</h3>
              <p>{activeItem.description}</p>
              <div className="lightbox-nav">
                <button onClick={() => moveTo(activeIndex - 1)} aria-label={t.selected.previous}>Previous</button>
                <button onClick={() => moveTo(activeIndex + 1)} aria-label={t.selected.next}>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}