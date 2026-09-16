import type { Language, TranslationSet } from '../types/furniture'

export function Footer({ language, setLanguage, t }: { language: Language; setLanguage: (language: Language) => void; t: TranslationSet }) {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div>
          <a className="footer-brand" href="#home">
            <img src="/images/nika-logo.png" alt="NIKA Furnitures and Wood Work" />
            <span>FURNITURES<br />&amp; WOOD WORK</span>
          </a>
          <p>{t.footer.description}</p>
        </div>

        <div>
          <p className="footer-label">Navigate</p>
          <a href="#home">{t.nav.home}</a>
          <a href="#furniture">{t.nav.furniture}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>

        <div>
          <p className="footer-label">Social</p>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer noopener">TikTok</a>
          <p>{t.footer.placeholder}</p>
        </div>

        <div>
          <p className="footer-label">Language</p>
          <div className="footer-languages">
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>English</button>
            <button className={language === 'am' ? 'active' : ''} onClick={() => setLanguage('am')}>አማርኛ</button>
          </div>
        </div>
      </div>

      <div className="page-shell footer-bottom">
        <span>{t.footer.rights}</span>
        <span>Designed for everyday living.</span>
      </div>
    </footer>
  )
}