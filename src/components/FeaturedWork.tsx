import { furnitureItems } from '../data/furniture'
import type { TranslationSet } from '../types/furniture'
import { ImageWithFallback } from './ImageWithFallback'

export function FeaturedWork({ t }: { t: TranslationSet }) {
  const featured = furnitureItems.filter((item) => item.featured)
  return (
    <section className="section featured-section section-reveal" id="featured">
      <div className="page-shell">
        <div className="section-intro featured-intro"><div><p className="eyebrow">{t.featured.eyebrow}</p><h2>{t.featured.title}</h2></div><p className="section-lede">{t.featured.description}</p></div>
        <div className="featured-grid">
          {featured.map((item, index) => (
            <article className={`featured-item featured-item-${index + 1}`} key={item.id}>
              <div className="featured-image-wrap"><ImageWithFallback src={item.image} alt={item.alt} /></div>
              <div className="featured-meta"><div><p className="item-kicker">{item.category}</p><h3>{item.title}</h3><p>{item.description}</p></div><a className="text-link" href="#contact">{t.featured.viewCollection} <span aria-hidden="true">↗</span></a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}