import { useEffect } from 'react'
import type { Language } from '../types/furniture'
import { translations } from '../data/translations'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { SelectedFurniture } from '../components/SelectedFurniture'
import { FeaturedWork } from '../components/FeaturedWork'
import { Craftsmanship } from '../components/Craftsmanship'
import { ContactCTA } from '../components/ContactCTA'
import { TikTokFeed } from '../components/TikTokFeed'
import { Footer } from '../components/Footer'

export function Home({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  const t = translations[language]
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.section-reveal')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [language])

  return <><Navbar language={language} setLanguage={setLanguage} t={t} /><main><Hero t={t} /><SelectedFurniture t={t} /><FeaturedWork t={t} /><Craftsmanship t={t} /><TikTokFeed t={t} /><ContactCTA t={t} /></main><Footer language={language} setLanguage={setLanguage} t={t} /></>
}