import { socialItems } from '../data/social'
import type { TranslationSet } from '../types/furniture'
import { ImageWithFallback } from './ImageWithFallback'

export function TikTokFeed({ t }: { t: TranslationSet }) {
  return (
    <section className="social-section section-reveal" id="workshop">
      <div className="page-shell">
        <div className="social-heading">
          <div>
            <p className="eyebrow">{t.social.eyebrow}</p>
            <h2>{t.social.title}</h2>
          </div>
          <p>{t.social.description}</p>
        </div>

        <div className="social-strip">
          {socialItems.map((item, index) => (
            <a
              className={`social-item social-item-${index + 1}`}
              href={item.externalUrl ?? item.url}
              key={item.id}
              target={item.externalUrl ? '_blank' : undefined}
              rel={item.externalUrl ? 'noreferrer noopener' : undefined}
              aria-label={`${item.title}, ${item.category}`}
            >
              <div className="social-media">
                <ImageWithFallback src={item.thumbnail} alt={item.title} />
                <span className="social-play" aria-hidden="true">▶</span>
                <span className="social-category">{item.category}</span>
              </div>
              <span className="social-title">{item.title}</span>
            </a>
          ))}
        </div>

        <a className="button button-outline" href="https://www.tiktok.com/" target="_blank" rel="noreferrer noopener">{t.social.follow} <span aria-hidden="true">↗</span></a>
        <p className="social-placeholder">{t.social.placeholder}</p>
      </div>
    </section>
  )
}