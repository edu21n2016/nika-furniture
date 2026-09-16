import { useEffect, useState } from 'react'
import type { Language, TranslationSet } from '../types/furniture'

type NavbarProps = { language: Language; setLanguage: (language: Language) => void; t: TranslationSet }

export function Navbar({ language, setLanguage, t }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.furniture, href: '#furniture' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-shell">
        <a className="brand-lockup" href="#home" aria-label="NIKA Furnitures and Wood Work">
          <img src="/images/nika-logo.png" alt="NIKA Furnitures and Wood Work" />
        </a>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
          <a className="nav-cta mobile-cta" href="#contact" onClick={() => setMenuOpen(false)}>{t.nav.getInTouch}</a>
        </nav>

        <div className="nav-actions">
          <div className="language-switcher" aria-label="Language selection">
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>EN</button>
            <span>/</span>
            <button className={language === 'am' ? 'active' : ''} onClick={() => setLanguage('am')} aria-pressed={language === 'am'}>አማ</button>
          </div>
          <a className="nav-cta desktop-cta" href="#contact">{t.nav.getInTouch}</a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}