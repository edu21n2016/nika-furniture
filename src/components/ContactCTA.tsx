import type { TranslationSet } from '../types/furniture'

export function ContactCTA({ t }: { t: TranslationSet }) {
  return (
    <section className="contact-section section-reveal" id="contact">
      <div className="contact-backdrop" />
      <div className="page-shell contact-inner">
        <div>
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2>{t.contact.title}</h2>
        </div>
        <div className="contact-side">
          <p>{t.contact.description}</p>
          <a className="button button-dark" href="#home">{t.contact.button} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  )
}