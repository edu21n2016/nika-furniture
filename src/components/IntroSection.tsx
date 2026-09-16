import type { TranslationSet } from '../types/furniture'

export function IntroSection({ t }: { t: TranslationSet }) {
  return (
    <section className="intro-section section-reveal" aria-labelledby="intro-title">
      <div className="page-shell intro-inner">
        <p className="eyebrow">{t.intro.eyebrow}</p>
        <h2 id="intro-title">{t.intro.title}</h2>
        <p>{t.intro.description}</p>
      </div>
    </section>
  )
}