import { collectionImages } from '../data/furniture'
import type { TranslationSet } from '../types/furniture'
import { ImageWithFallback } from './ImageWithFallback'

const collections = [
  { key: 'diningTables', title: 'Dining Tables', description: 'For meals that become memories.', image: collectionImages.diningTables },
  { key: 'beds', title: 'Beds', description: 'A softer place to land.', image: collectionImages.beds },
  { key: 'diningSets', title: 'Dining Sets', description: 'Gather around something beautiful.', image: collectionImages.diningSets },
  { key: 'customWoodwork', title: 'Custom Woodwork', description: 'Made around your way of living.', image: collectionImages.customWoodwork },
]

export function FurnitureCollections({ t }: { t: TranslationSet }) {
  return (
    <section className="section collections-section section-reveal" id="furniture">
      <div className="page-shell">
        <div className="section-intro collections-intro">
          <div><p className="eyebrow">{t.collections.eyebrow}</p><h2>{t.collections.title}</h2></div>
          <p className="section-lede">{t.collections.description}</p>
        </div>
        <div className="collection-grid">
          {collections.map((collection, index) => (
            <a className={`collection-item collection-${index + 1}`} href="#featured" key={collection.key}>
              <div className="collection-image-wrap"><ImageWithFallback src={collection.image} alt={`${collection.title} furniture`} /></div>
              <div className="collection-meta"><div><p className="item-kicker">0{index + 1} / Collection</p><h3>{collection.title}</h3><p>{collection.description}</p></div><span className="round-arrow" aria-hidden="true">↗</span></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}