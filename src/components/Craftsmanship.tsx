import type { TranslationSet } from '../types/furniture'
import { ImageWithFallback } from './ImageWithFallback'

export function Craftsmanship({ t }: { t: TranslationSet }) {
  return (
    <section className="section craftsmanship-section section-reveal" id="about">
      <div className="craftsmanship-grid page-shell">
        <div className="craft-image"><ImageWithFallback src="/images/master_woodworking_workshop_editorial_photography_showing_handcrafted_custom.png" alt="Woodworker carefully shaping a piece in the workshop" /><span className="image-caption">The workshop / NIKA</span></div>
        <div className="craft-copy"><p className="eyebrow">{t.craftsmanship.eyebrow}</p><h2>{t.craftsmanship.title}</h2><p>{t.craftsmanship.description}</p><a className="text-link" href="#contact">{t.craftsmanship.link} <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  )
}