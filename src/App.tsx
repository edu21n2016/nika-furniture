import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, Play, Send, X } from 'lucide-react'
import {
  achievements,
  contact,
  craftsmanshipSteps,
  furniture,
  heroSlides,
  Item,
  latestCreations,
  navItems,
  signaturePieces,
  workshopCaptions,
} from './content'

const slug = (value: string) => `#${value.toLowerCase().replace(' ', '-')}`

function Heading({
  label,
  title,
  dark = false,
  size = 'md',
}: {
  label: string
  title: string
  dark?: boolean
  size?: 'md' | 'lg'
}) {
  return (
    <div className="mb-10 animate-[reveal_.6s_ease-out_both] md:mb-14">
      <p className={`mb-3 text-[10px] font-semibold tracking-[.3em] uppercase ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
        {label}
      </p>
      <h2 className={`font-serif font-light tracking-tight ${size === 'lg' ? 'text-4xl md:text-6xl' : 'text-4xl md:text-5xl'} ${dark ? 'text-stone-100' : 'text-stone-900'}`}>
        {title}
      </h2>
    </div>
  )
}
// Lighter figure reused by the project, craftsmanship and showroom blocks —
// intentionally borderless, unlike the denser signature tiles.
function EditorialFigure({ item, className = '', ratio = 'aspect-[4/5]' }: { item: Item; className?: string; ratio?: string }) {
  return (
    <figure className={`group ${className}`}>
      <div className={`overflow-hidden rounded-sm bg-stone-200 ${ratio}`}>
        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
      </div>
      <figcaption className="mt-5">
        <h3 className="font-serif text-xl text-stone-900">{item.title}</h3>
        <p className="mt-1 text-[10px] tracking-widest text-stone-500 uppercase">{item.text}</p>
      </figcaption>
    </figure>
  )
}
function SignatureTile({
  item,
  className = '',
  ratio = 'aspect-[4/5]',
  onOpen,
}: {
  item: Item
  className?: string
  ratio?: string
  onOpen: () => void
}) {
  const [light, setLight] = useState({ x: 50, y: 50 })

  const track = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setLight({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <article className={`signature-tile group relative ${className}`} onMouseMove={track}>
      <button type="button" onClick={onOpen} aria-label={`View ${item.title}`} className={`tile-frame block ${ratio}`}>
        <img src={item.image} alt={item.title} />
        <span className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="absolute bottom-5 left-5 translate-y-3 text-left opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="block font-serif text-xl text-white">{item.title}</span>
          <span className="mt-1 block text-[10px] tracking-widest text-stone-300 uppercase">{item.text}</span>
          <span className="mt-2 inline-flex items-center gap-2 text-[10px] tracking-widest text-white uppercase">
            View Piece <ArrowRight size={13} />
          </span>
        </span>
      </button>
      {/* Soft light that follows the cursor over the tile. */}
      <span aria-hidden="true" className="cursor-light" style={{ left: `${light.x}%`, top: `${light.y}%` }} />
    </article>
  )
}
function PieceLightbox({ item, onClose }: { item: Item | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return undefined
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  if (!item) return null
  return (
    <div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-[60] grid place-items-center bg-stone-950/90 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="grid w-full max-w-4xl overflow-hidden bg-[#fdfcf9] md:grid-cols-2" onClick={(event) => event.stopPropagation()}>
        <img src={item.image} alt={item.title} className="h-64 w-full object-cover md:h-full" />
        <div className="relative p-8 md:p-10">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute top-5 right-5 text-stone-500 transition hover:text-stone-900">
            <X size={20} />
          </button>
          <p className="text-[10px] tracking-[.3em] text-stone-500 uppercase">Signature Piece</p>
          <h3 className="mt-4 font-serif text-3xl font-light text-stone-900">{item.title}</h3>
          <p className="mt-4 text-[10px] tracking-widest text-stone-500 uppercase">{item.text}</p>
          <p className="mt-6 text-sm leading-7 text-stone-600">
            Made in our Addis Ababa workshop from carefully selected solid wood. Visit the showroom to experience the materials, finishes and craftsmanship in person.
          </p>
        </div>
      </div>
    </div>
  )
}
function BrandCursor() {
  const cursor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    const follow = (event: PointerEvent) => {
      cursor.current?.style.setProperty('--cursor-x', `${event.clientX}px`)
      cursor.current?.style.setProperty('--cursor-y', `${event.clientY}px`)
      cursor.current?.classList.toggle('is-active', Boolean((event.target as HTMLElement).closest('a,button')))
    }
    window.addEventListener('pointermove', follow)
    return () => window.removeEventListener('pointermove', follow)
  }, [])
  return <div ref={cursor} className="brand-cursor" aria-hidden="true" />
}
function Header() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const ids = navItems.map(x => x.toLowerCase().replace(' ', '-'))
    const onScroll = () => {
      let active = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) active = id
      }
      setCurrent(active)
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <header className={`site-header fixed inset-x-0 top-0 z-50 text-stone-100${scrolled ? ' is-scrolled' : ''}`}><nav className="nav-bar mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8"><a href="#home" aria-label="ANIKA home"><img src="/images/logow-removebg-preview.png" alt="ANIKA" className="h-12 w-30 object-contain object-left drop-shadow-md" /></a><div className="hidden items-center gap-2 md:flex">{navItems.map(x => <a key={x} href={slug(x)} className={`nav-link rounded-full px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${current === x.toLowerCase().replace(' ', '-') ? 'is-current' : ''}`}>{x}</a>)}</div><a href="#contact" className="nav-cta hidden border border-white/50 bg-white/10 px-6 py-3 text-xs tracking-widest uppercase transition-colors duration-300 md:block">Explore Our Work</a><button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><Menu /></button></nav>{open && <div className="border-t border-white/10 bg-stone-950/90 px-6 pb-5 backdrop-blur-md md:hidden">{navItems.map(x => <a key={x} href={slug(x)} className="nav-link block px-2 py-3 text-base tracking-wide uppercase">{x}</a>)}</div>}</header> }
function Hero() {
  const [slide, setSlide] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6500); return () => window.clearInterval(timer) }, [])
  const current = heroSlides[slide]
  return <section id="home" className="relative flex min-h-svh flex-col justify-center px-3 pt-24 pb-8 text-white md:px-6 md:pt-28 md:pb-12">
    {/* Almost full-width image panel: only a thin dust band shows down each side. */}
    <div className="hero-glass mx-auto flex min-h-[80svh] w-full max-w-[1600px] flex-col justify-center px-8 py-16 md:px-16 md:py-20">
      {heroSlides.map((item, index) => <img key={item.image} src={item.image} alt="ANIKA furniture interior" className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${index === slide ? 'scale-100' : 'scale-105 opacity-0'}`} />)}
      {/* Readability wash only — kept light so the photograph stays crisp. */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/30 to-stone-950/5" />
      <div className="absolute right-8 bottom-8 z-10 flex items-center gap-3 md:right-12 md:bottom-10"><button onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)} aria-label="Previous image" className="hero-ghost grid h-11 w-11 place-items-center rounded-full border-white/40"><ArrowLeft size={18}/></button><span className="w-12 text-center text-[10px] tracking-[.18em] text-white">0{slide + 1} / 0{heroSlides.length}</span><button onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Next image" className="hero-ghost grid h-11 w-11 place-items-center rounded-full border-white/40"><ArrowRight size={18}/></button></div>
      <motion.div key={current.title[0]} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="relative w-full"><p className="mb-5 text-[10px] tracking-[.25em] text-stone-300 uppercase">{current.eyebrow}</p><h1 className="font-serif text-6xl leading-[.9] font-light tracking-tighter md:text-8xl"><span className="hero-word">{current.title[0]}</span><br /><em className="hero-word hero-word--accent">{current.title[1]}</em></h1><p className="mt-7 max-w-md text-sm leading-7 text-stone-200">{current.copy}</p><div className="mt-9 flex flex-wrap gap-4"><a href="#furniture" className="hero-cta border-white/60 bg-white/10 px-6 py-3 text-xs tracking-widest uppercase">Explore Our Work</a><a href="#about" className="hero-ghost border-white/35 px-6 py-3 text-xs tracking-widest uppercase">Discover ANIKA</a></div></motion.div>
    </div>
  </section>
}
function Signature() {
  const [active, setActive] = useState<Item | null>(null)
  const open = (item: Item) => setActive(item)
  return (
    <section id="furniture" className="bg-[rgba(253,252,249,0.9)] px-6 pt-16 pb-24 md:px-8 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading label="01 / Signature pieces" title="SIGNATURE PIECES" />
          <p className="mb-10 max-w-sm text-sm leading-7 text-stone-600 md:mb-14">
            Furniture shaped by natural materials, thoughtful design, and skilled hands.
          </p>
        </div>
        {/* Asymmetric editorial composition — one tall feature beside larger supporting pieces. */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-12 md:gap-7">
          <SignatureTile item={signaturePieces[0]} onOpen={() => open(signaturePieces[0])} className="col-span-2 md:col-span-7 md:row-span-2" ratio="aspect-[4/5]" />
          <SignatureTile item={signaturePieces[3]} onOpen={() => open(signaturePieces[3])} className="md:col-span-5" ratio="aspect-[5/4]" />
          <SignatureTile item={signaturePieces[4]} onOpen={() => open(signaturePieces[4])} className="md:col-span-5" ratio="aspect-[5/4]" />
          <SignatureTile item={signaturePieces[2]} onOpen={() => open(signaturePieces[2])} className="md:col-span-6" ratio="aspect-[16/10]" />
          <SignatureTile item={signaturePieces[1]} onOpen={() => open(signaturePieces[1])} className="md:col-span-6" ratio="aspect-[16/10]" />
        </div>
      </div>
      <PieceLightbox item={active} onClose={() => setActive(null)} />
    </section>
  )
}
// Project-focused, not product-focused: no prices, quick-view or inquiry CTAs.
function LatestCreations() {
  return (
    <section className="bg-white/78 px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Heading label="02 / Recent work" title="LATEST CREATIONS" />
        <p className="-mt-4 mb-14 max-w-lg text-sm leading-7 text-stone-600 md:-mt-6">
          Recent work from our workshop and showroom.
        </p>
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <EditorialFigure item={latestCreations[0]} className="md:col-span-7" ratio="aspect-[4/3]" />
          <div className="grid gap-10 md:col-span-5">
            <EditorialFigure item={latestCreations[1]} ratio="aspect-[5/3]" />
            <EditorialFigure item={latestCreations[2]} ratio="aspect-[5/3]" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Craftsmanship() {
  return (
    <section className="bg-stone-950 px-6 py-24 text-stone-100 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
        <img
          src={furniture[3].image}
          alt="Hands at work in the ANIKA workshop"
          className="h-[420px] w-full object-cover md:h-[620px]"
        />
        <div>
          <Heading label="03 / Our approach" title="MADE BY HAND. DESIGNED TO LAST." dark />
          <p className="max-w-lg text-sm leading-7 text-stone-300">
            Every piece begins with the material. We work solid wood by hand, letting grain, weight and
            proportion guide the design, then finish each surface carefully so the furniture ages well
            rather than dates.
          </p>
          <div className="mt-12 border-t border-white/10">
            {craftsmanshipSteps.map((step) => (
              <div key={step.title} className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[150px_1fr]">
                <p className="text-[10px] tracking-[.3em] text-[#d77a66] uppercase">{step.title}</p>
                <p className="text-sm leading-7 text-stone-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Achievements() {
  return (
    <section className="bg-stone-900 px-6 py-20 text-stone-100 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-[10px] tracking-[.3em] text-stone-400 uppercase">04 / Our work in numbers</p>
        <h2 className="mb-14 font-serif text-4xl font-light tracking-tight md:text-5xl">OUR WORK IN NUMBERS</h2>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {achievements.map(([value, label]) => (
            <div key={label}>
              <p className="font-serif text-5xl font-light md:text-6xl">{value}</p>
              <p className="mt-3 text-[10px] leading-5 tracking-widest text-stone-400 uppercase">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[10px] tracking-widest text-stone-500 uppercase">Figures pending client confirmation.</p>
      </div>
    </section>
  )
}

function Showroom() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      <img src={furniture[0].image} alt="ANIKA showroom interior" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 py-28 md:px-8 md:py-40">
        <p className="mb-4 text-[10px] tracking-[.3em] text-stone-300 uppercase">05 / Visit us</p>
        <h2 className="max-w-2xl font-serif text-4xl font-light leading-[.95] tracking-tight md:text-6xl">STEP INTO OUR SHOWROOM</h2>
        <p className="mt-7 max-w-md text-sm leading-7 text-stone-200">
          Experience the furniture, materials, finishes and craftsmanship in person before a single piece is made for your space.
        </p>
        <a href="#contact" className="mt-10 inline-flex items-center gap-2 border-white/60 bg-white/10 px-6 py-3 text-[10px] tracking-widest uppercase transition hover:border-[#b53029] hover:bg-[#b53029]">
          Visit Our Showroom <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  )
}

// Video-first workshop strip. Structure is ready to swap in real TikTok embeds.
function Workshop() {
  return (
    <section className="bg-[#fdfcf9]/78 px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Heading label="06 / Follow the craft" title="FROM OUR WORKSHOP" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {workshopCaptions.map(([image, label]) => (
            <article key={label} className="group relative aspect-[9/16] overflow-hidden bg-stone-900">
              <img src={image} alt={label} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute top-5 left-5 grid h-10 w-10 place-items-center rounded-full border-white/40 text-white transition group-hover:bg-[#b53029]">
                <Play size={15} fill="currentColor" />
              </span>
              <p className="absolute right-5 bottom-5 left-5 text-sm text-white">{label}</p>
            </article>
          ))}
        </div>
        <a
          href="https://www.tiktok.com/@anikafurniture"
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-flex items-center gap-2 border-b border-stone-400 pb-1 text-[10px] tracking-widest text-stone-900 uppercase transition hover:border-[#b53029] hover:text-[#b53029]"
        >
          Follow us on TikTok <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', category: '', details: '' })
  const [sent, setSent] = useState(false)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setSent(true)
  }

  return (
    <section id="contact" className="bg-[#fdfcf9]/78 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        <div>
          <Heading label="07 / Contact" title={contact.heading} />
          <p className="max-w-md text-sm leading-7 text-stone-600">{contact.supporting}</p>
          <dl className="mt-10 space-y-5 text-sm text-stone-600">
            <div>
              <dt className="text-[10px] tracking-widest text-stone-500 uppercase">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="hover:text-[#b53029]">{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-widest text-stone-500 uppercase">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${contact.email}`} className="hover:text-[#b53029]">{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-widest text-stone-500 uppercase">Location</dt>
              <dd className="mt-1">{contact.location}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-widest text-stone-500 uppercase">Opening hours</dt>
              <dd className="mt-1">{contact.hours}</dd>
            </div>
          </dl>
          <a href="#contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[10px] tracking-widest text-white uppercase transition hover:bg-[#b53029]">
            Contact Us <ArrowUpRight size={14} />
          </a>
        </div>
        <form onSubmit={submit} className="rounded-2xl border-stone-200 bg-white/90 p-7 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            {(['name', 'email'] as const).map((field) => (
              <label key={field} className="text-xs text-stone-500 capitalize">
                {field}
                <input
                  required
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                  className="mt-2 w-full border-b border-stone-300 py-3 outline-none focus:border-[#b53029]"
                />
              </label>
            ))}
          </div>
          <label className="mt-6 block text-xs text-stone-500">
            Furniture Category
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="mt-2 w-full border-b border-stone-300 py-3 outline-none"
            >
              <option>Choose a category</option>
              {furniture.map((item) => <option key={item.title}>{item.title}</option>)}
            </select>
          </label>
          <label className="mt-6 block text-xs text-stone-500">
            Project Details
            <textarea
              rows={4}
              value={form.details}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
              className="mt-2 w-full border-b border-stone-300 py-3 outline-none"
            />
          </label>
          <button type="submit" className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[10px] tracking-widest text-white uppercase transition hover:bg-[#b53029]">
            <Send size={14} /> Send Inquiry
          </button>
          {sent && <p className="mt-4 text-xs text-stone-600">Thank you — we will be in touch shortly.</p>}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const groups: Array<[string, string[]]> = [
    ['Brand Story', ['ANIKA Furniture & Woodwork']],
    ['Quick Links', ['About', 'Furniture', 'Contact']],
    ['Categories', ['Sofas', 'Beds', 'Dining', 'Tables']],
  ]
  return (
    <footer className="bg-stone-950 px-6 py-16 text-stone-400 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        {groups.map(([title, links]) => (
          <div key={title}>
            <h3 className="text-[10px] tracking-widest text-white uppercase">{title}</h3>
            {links.map((link) => <p className="mt-4 text-sm" key={link}>{link}</p>)}
          </div>
        ))}
        <div>
          <h3 className="text-[10px] tracking-widest text-white uppercase">Newsletter</h3>
          <form
            className="mt-5 flex border-b border-stone-700"
            onSubmit={(event) => { event.preventDefault(); if (email.trim()) setSubscribed(true) }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              aria-label="Your email"
              className="w-full bg-transparent py-3 outline-none"
            />
            <button type="submit" aria-label="Subscribe" className="mt-3 text-stone-400 transition hover:text-white">
              <ArrowUpRight size={18} />
            </button>
          </form>
          {subscribed && <p className="mt-3 text-xs text-stone-500">Thanks for subscribing.</p>}
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] tracking-widest text-stone-500 uppercase">
        <p>© {new Date().getFullYear()} NIKA Furniture & Wood Work</p>
        <p>{contact.location}</p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="site-shell bg-[#fdfcf9]/70 text-stone-900">
      <BrandCursor />
      <Header />
      <main>
        <Hero />
        <Signature />
        <LatestCreations />
        <Craftsmanship />
        <Achievements />
        <Showroom />
        <Workshop />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
