export type Language = 'en' | 'am'

export type FurnitureItem = {
  id: string
  title: string
  category: string
  description: string
  image: string
  alt: string
  featured: boolean
  backgroundPosition?: string
}

export type HeroSlide = {
  id: string
  image: string
  title: string
  description: string
  eyebrow: string
  alt: string
}

export type SocialItem = {
  id: string
  title: string
  video: string
  thumbnail: string
  url: string
  category: string
  externalUrl?: string
}

export type TranslationSet = {
  nav: { home: string; furniture: string; about: string; contact: string; getInTouch: string }
  hero: { eyebrow: string; title: string; description: string; primary: string; secondary: string }
  collections: { eyebrow: string; title: string; description: string; explore: string }
  featured: { eyebrow: string; title: string; description: string; viewCollection: string }
  craftsmanship: { eyebrow: string; title: string; description: string; link: string }
  contact: { eyebrow: string; title: string; description: string; button: string }
  footer: { description: string; contact: string; placeholder: string; rights: string }
  intro: { eyebrow: string; title: string; description: string }
  social: { eyebrow: string; title: string; description: string; follow: string; placeholder: string }
  selected: { eyebrow: string; title: string; description: string; previous: string; next: string; open: string; close: string; viewDetails: string }
}