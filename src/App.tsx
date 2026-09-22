import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, Play, Send, X } from 'lucide-react'
import { ParticleHeadline } from './ParticleHeadline'
import {
  achievements,
  contact,
  furniture,
  heroSlides,
  Item,
  navItems,
  newArrivals,
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
  // The three header items (logo, links, CTA) have different natural heights, so
  // `items-center` alone leaves them looking misaligned. Each is boxed to the same
  // 56px line, so all three share one centre line down the 96px bar. The links sit
  // in their own absolutely-centred group so the set is centred on the page, not
  // merely balanced between the logo and the CTA.
  return <header className={`site-header fixed inset-x-0 top-0 z-50${scrolled ? ' is-scrolled' : ''}`}><nav className="nav-bar relative mx-auto flex h-24 max-w-[1400px] items-center justify-between gap-6 px-6 md:px-8"><a href="#home" aria-label="ANIKA home" className="brand-mark flex h-[76px] shrink-0 items-center overflow-visible"><img src="/images/logow-removebg-preview.png" alt="ANIKA" className="brand-mark__img h-[76px] w-auto max-w-none object-contain object-left" /></a><div className="relative hidden h-14 items-center justify-center gap-2 md:absolute md:left-1/2 md:-translate-x-1/2 md:flex">{navItems.map(x => <a key={x} href={slug(x)} className={`nav-link rounded-full px-4 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${current === x.toLowerCase().replace(' ', '-') ? 'is-current' : ''}`}>{x}</a>)}</div><a href="#contact" className="nav-cta hidden shrink-0 items-center border border-white/50 bg-white/10 px-7 py-3 text-[11px] leading-none tracking-widest uppercase transition-colors duration-300 md:inline-flex">Explore Our Work</a><button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><Menu /></button></nav>{open && <div className="mobile-panel border-t border-white/10 bg-stone-950/90 px-6 pb-5 backdrop-blur-md md:hidden">{navItems.map(x => <a key={x} href={slug(x)} className="nav-link block px-2 py-3 text-base tracking-wide uppercase">{x}</a>)}</div>}</header> }
function Hero() {
  const [slide, setSlide] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6500); return () => window.clearInterval(timer) }, [])
  const current = heroSlides[slide]
  // No bottom padding: the hero runs straight into the signature section so no
  // empty strip of page background shows underneath it.
  return <section id="home" className="relative flex min-h-svh flex-col justify-center px-2 pt-24 text-white md:px-4 md:pt-28">
    {/* Near-full-width image panel: the frame runs close to the viewport edges so
        only a slim band of dust shows, rather than a wide empty margin each side. */}
    <div className="hero-glass mx-auto flex min-h-[86svh] w-full max-w-[1900px] flex-col justify-center px-8 py-12 md:px-16 md:py-14">
      {heroSlides.map((item, index) => <img key={item.image} src={item.image} alt="ANIKA furniture interior" className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${index === slide ? 'scale-100' : 'scale-105 opacity-0'}`} />)}
      {/* Readability wash only — concentrated on the left, where the headline and
          copy sit, and almost absent on the right so the photograph reads crisp. */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/55 via-transparent to-transparent" />
      {/* Narrow band at the very top: gives the header something to sit on where
          the photo runs bright. Fades out well above the headline. */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-stone-950/60 to-transparent" />
      <div className="absolute right-8 bottom-8 z-10 flex items-center gap-3 md:right-12 md:bottom-10"><button onClick={() => setSlide((slide + heroSlides.length - 1) % heroSlides.length)} aria-label="Previous image" className="hero-ghost grid h-11 w-11 place-items-center rounded-full border-white/40"><ArrowLeft size={18}/></button><span className="w-12 text-center text-[10px] tracking-[.18em] text-white">0{slide + 1} / 0{heroSlides.length}</span><button onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Next image" className="hero-ghost grid h-11 w-11 place-items-center rounded-full border-white/40"><ArrowRight size={18}/></button></div>
      <motion.div key={current.title[0]} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="relative w-full"><p className="mb-5 text-[10px] tracking-[.25em] text-stone-300 uppercase">{current.eyebrow}</p><h1 className="font-serif text-6xl leading-[.9] font-light tracking-tighter md:text-8xl"><span className="hero-word">{current.title[0]}</span><br /><em className="hero-word hero-word--accent">{current.title[1]}</em></h1><p className="mt-7 max-w-md text-sm leading-7 text-stone-200">{current.copy}</p><div className="mt-9 flex flex-wrap gap-4"><a href="#furniture" className="hero-cta border-white/60 bg-white/10 px-6 py-3 text-xs tracking-widest uppercase">Explore Our Work</a><a href="#about" className="hero-ghost border-white/35 px-6 py-3 text-xs tracking-widest uppercase">Discover ANIKA</a></div></motion.div>
    </div>
  </section>
}
function Signature() {
  const [active, setActive] = useState<Item | null>(null)
  const open = (item: Item) => setActive(item)
  return (
    <section id="furniture" className="relative scroll-mt-24 px-6 pb-16 pt-12 md:px-8 md:pb-20 md:pt-14">
      {/* Wider than the text column on purpose, so the gallery reads as the hero of
          this section. md:px-8 gutter plus max-w-[1560px] leaves a slim but clearly
          intentional margin at a 1440px viewport — enough to read as designed
          breathing space, without the wide band of empty background the narrower
          container used to leave on each side. */}
      <div className="mx-auto max-w-[1560px]">
        {/* Full-width headline that assembles itself from wood chips flying in from
            all four edges — and replays every time the section scrolls into view. */}
        {/* Height scales with the viewport so the auto-fitted letters are never
            clipped top or bottom, and the text sits inside a centered column. */}
        <ParticleHeadline text="SIGNATURE PIECES" mode="assemble" weight={300} className="mx-auto h-[64px] w-full max-w-[880px] md:h-[112px]" />
        {/* Description: a step up from the muted body copy elsewhere — medium weight
            and a slightly larger size so it reads as an intentional lead-in to the
            gallery rather than a caption. Still the same stone tone, so it stays in
            the existing palette. */}
        <p className="mx-auto mt-6 mb-11 max-w-2xl text-center text-base leading-8 font-medium text-stone-700 md:mt-7 md:mb-12 md:text-lg">
          Discover a selection of Anika&rsquo;s finest furniture, thoughtfully designed to bring
          warmth, comfort, and character to every space.
        </p>
        {/* Five-piece gallery in two columns. Each column is a two-part stack:

            left  — a wide tile above the tall feature
            right — three wide tiles
            Every tile in a column shares that column's width, so both outer
            edges run perfectly straight even though the tiles differ in height. */}
        <div className="mx-auto grid max-w-[1560px] gap-4 md:grid-cols-2 md:gap-5">
          {/* Left column: wide tile on top, tall feature below. */}
          <div className="grid gap-4 md:gap-5">
            <SignatureTile item={signaturePieces[4]} onOpen={() => open(signaturePieces[4])} ratio="aspect-[16/10]" />
            <SignatureTile item={signaturePieces[0]} onOpen={() => open(signaturePieces[0])} ratio="aspect-[4/5]" />
          </div>
          {/* Right column: three wide tiles. */}
          <div className="grid gap-4 md:gap-5">
            <SignatureTile item={signaturePieces[3]} onOpen={() => open(signaturePieces[3])} ratio="aspect-[16/10]" />
            <SignatureTile item={signaturePieces[2]} onOpen={() => open(signaturePieces[2])} ratio="aspect-[16/10]" />
            <SignatureTile item={signaturePieces[1]} onOpen={() => open(signaturePieces[1])} ratio="aspect-[16/10]" />
          </div>
        </div>
        {/* Centred showroom CTA under the whole gallery. Sized and weighted like a
            navigation control rather than a shopping button: it lifts slightly on
            hover, the fill wipes to burgundy, and the arrow shifts with it. */}
        <div className="mt-14 flex justify-center md:mt-16">
          <a
            href="#furniture"
            className="view-all-btn inline-flex items-center gap-3 border border-stone-900/25 bg-transparent px-9 py-4 text-[10px] tracking-[.25em] text-stone-900 uppercase"
          >
            View All Products
            <ArrowRight size={14} className="view-all-btn__arrow" />
          </a>
        </div>
      </div>
      <PieceLightbox item={active} onClose={() => setActive(null)} />
    </section>
  )
}
// New Arrivals — the rail drifts right-to-left on its own, forever. It is a CSS
// marquee rather than a scroll container: the card list is rendered twice inside a
// track that translates -50%, so the second copy is always sliding in behind the
// first and the loop never shows a seam. The 4:5 portrait frames and fixed card
// width keep the row even as it moves. Hovering or focusing pauses the glide so a
// visitor can read a card, and reduced-motion users get a static row they can scroll.
function NewArrivals() {
  const railRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative px-6 pb-24 pt-12 md:px-8 md:pb-32 md:pt-14">
      {/* Solid type, not particles: the title is real text in the woody brand tone,
          set bold and at the same box height as the Signature Pieces headline. It
          slides right-to-left on its own in a marquee rail, so the word keeps
          travelling without the letterforms ever breaking up. */}
      <div className="mx-auto max-w-[1560px]">
        <div className="arrivals-marquee mx-auto h-[64px] w-full max-w-[880px] md:h-[112px]">
          <span className="arrivals-marquee__word">NEW ARRIVALS</span>
          <span className="arrivals-marquee__word" aria-hidden="true">NEW ARRIVALS</span>
        </div>
        {/* The supporting line sits directly on the page background — no panel — now
            that nothing is moving underneath it. */}
        <p className="mx-auto mt-6 mb-14 max-w-xl text-center text-sm leading-7 text-stone-700 md:mt-8 md:mb-16">
          The latest pieces to leave our workshop — a slow drift through the full rail.
        </p>
      </div>

      {/* The rail runs edge to edge: the section's own padding is cancelled with
          negative margins so the cards pass across the full width of the page. The
          list is printed twice; the duplicate is hidden from assistive tech, since it
          is the same ten pieces and only exists to close the loop. */}
      <div id="arrivals-rail" ref={railRef} className="arrivals-rail -mx-6 md:-mx-8">
        <div className="arrivals-rail__track">
          {[0, 1].map((pass) => (
            <div className="arrivals-rail__group" key={pass} aria-hidden={pass === 1}>
              {newArrivals.map((item, index) => (
                <article key={`${pass}-${item.title}-${index}`} className="arrival-card">
                  <div className="arrival-card__frame">
                    <img src={item.image} alt={pass === 0 ? item.title : ''} />
                    {item.tag && <span className="discount-badge">{item.tag}</span>}
                  </div>
                  <div className="mt-5">
                    <h3 className="font-serif text-xl font-light text-stone-900">{item.title}</h3>
                    <p className="mt-2 text-[10px] tracking-widest text-stone-500 uppercase">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Wood Work / "Who We Are". The workshop photograph on the right, larger than before,
// with a floating two-stat card overlapping its bottom corner; the copy on the left,
// which now sits on a plain white card so every word is legible against the dust.
function Craftsmanship() {
  const promises = [
    { title: 'Trusted Furniture Store', text: 'Handcrafted with attention to material and detail.' },
    { title: 'Bespoke Customization', text: 'Tailored to fit your architectural space.' },
    { title: 'Safe Delivery & Setup', text: 'Direct white-glove installation from our workshop.' },
  ]
  // One proof figure: the years of experience. The client count was dropped at the
  // client's request, so the card carries a single number and reads as a statement
  // rather than a list.
  const stats = [{ value: '10', label: 'Years of Experience' }]
  return (
    // Trimmed top padding: the Signature gallery already ends with the CTA and its
    // own generous bottom padding, so the old py-24 stacked a second full gap on top
    // of it and left a dead band between the two sections.
    <section className="relative px-6 pb-24 pt-8 md:px-8 md:pb-32 md:pt-10">
      {/* Two columns pressed together: the copy card on the right and the photograph
          on the left, with no gap at all between them (`gap-0`). The columns only
          split at lg, so on smaller screens the image stacks above the card and the
          pair still reads as one block. */}
      <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-[1.15fr_1fr]">
        {/* The photograph plus its floating proof card, on the left. It stretches to
            the card's height so the two remain flush however the copy wraps. */}
        <div className="relative lg:order-1">
          <img
            src={furniture[3].image}
            alt="Hands at work in the ANIKA workshop"
            className="h-[360px] w-full rounded-sm object-cover md:h-[560px] lg:h-full lg:rounded-r-none"
          />
          <div className="who-badge">
            {stats.map((stat) => (
              <div key={stat.label} className="who-badge__stat">
                <span className="who-badge__value">{stat.value}</span>
                <p className="who-badge__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The entire copy column is one solid white card — heading, sentence and the
            three promises — so nothing here has to compete with the dust field. It
            butts directly against the photograph: square on the left, rounded on the
            right, so the two columns read as a single attached panel. */}
        <div className="who-card lg:order-2">
          <ParticleHeadline
            text="WHO WE ARE"
            mode="assemble"
            maxFontSize={40}
            weight={700}
            className="h-[38px] w-full max-w-[320px]"
          />
          <h2 className="who-title">Let us turn your home into a sanctuary.</h2>
          <ul className="mt-9 space-y-6">
            {promises.map((promise) => (
              <li key={promise.title} className="flex gap-4">
                {/* Gold tick mark, drawn inline so it stays crisp at any size. */}
                <span aria-hidden="true" className="who-tick">
                  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 8.5l3.5 3.5 7-8" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{promise.title}</p>
                  <p className="mt-1 text-sm leading-7 text-stone-600">{promise.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// Was bg-stone-900. Now the shared cream surface, so the numbers sit in the same
// environment as the rest of the page.
function Achievements() {
  return (
    <section className="relative px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-[10px] tracking-[.3em] text-stone-500 uppercase">04 / Our work in numbers</p>
        <h2 className="mb-14 font-serif text-4xl font-light tracking-tight text-stone-900 md:text-5xl">OUR WORK IN NUMBERS</h2>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {achievements.map(([value, label]) => (
            <div key={label}>
              <p className="font-serif text-5xl font-light text-stone-900 md:text-6xl">{value}</p>
              <p className="mt-3 text-[10px] leading-5 tracking-widest text-stone-500 uppercase">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[10px] tracking-widest text-stone-400 uppercase">Figures pending client confirmation.</p>
      </div>
    </section>
  )
}

// Was a full-bleed dark photograph with a black gradient overlay — a third
// background treatment. It now sits on the shared cream surface, with the
// showroom photograph kept as a framed image inside the panel so the room still
// reads without replacing the homepage background.
function Showroom() {
  return (
    <section className="relative px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-[10px] tracking-[.3em] text-stone-500 uppercase">05 / Visit us</p>
          <h2 className="max-w-2xl font-serif text-4xl font-light leading-[.95] tracking-tight text-stone-900 md:text-6xl">STEP INTO OUR SHOWROOM</h2>
          <p className="mt-7 max-w-md text-sm leading-7 text-stone-600">
            Experience the furniture, materials, finishes and craftsmanship in person before a single piece is made for your space.
          </p>
          <a href="#contact" className="mt-10 inline-flex items-center gap-2 border bg-[#b53029] px-6 py-3 text-[10px] tracking-widest text-white uppercase transition hover:border-[#b53029] hover:bg-white hover:text-[#b53029]">
            Visit Our Showroom <ArrowUpRight size={14} />
          </a>
        </div>
        <img
          src={furniture[0].image}
          alt="ANIKA showroom interior"
          className="h-[320px] w-full rounded-sm object-cover md:h-[460px]"
        />
      </div>
    </section>
  )
}

// Video-first workshop strip. Structure is ready to swap in real TikTok embeds.
function Workshop() {
  return (
    <section className="relative px-6 py-24 md:px-8 md:py-32">
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
    <section id="contact" className="relative scroll-mt-24 px-6 py-24 md:px-12 md:py-32">
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
          <a href="#contact" className="mt-10 inline-flex items-center gap-2 rounded-sm bg-[#b53029] px-6 py-3 text-[10px] tracking-widest text-white uppercase transition hover:bg-stone-900">
            Contact Us <ArrowUpRight size={14} />
          </a>
        </div>
        <form onSubmit={submit} className="rounded-sm border border-stone-900/10 bg-[rgba(253,252,249,.35)] p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {(['name', 'email'] as const).map((field) => (
              <label key={field} className="text-xs text-stone-500 capitalize">
                {field}
                <input
                  required
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                  className="mt-2 w-full border-b border-stone-900/20 bg-transparent py-3 outline-none focus:border-[#b53029]"
                />
              </label>
            ))}
          </div>
          <label className="mt-6 block text-xs text-stone-500">
            Furniture Category
            <select
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="mt-2 w-full appearance-none border-b border-stone-900/20 bg-transparent py-3 outline-none focus:border-[#b53029]"
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
              className="mt-2 w-full border-b border-stone-900/20 bg-transparent py-3 outline-none focus:border-[#b53029]"
            />
          </label>
          <button type="submit" className="mt-8 inline-flex items-center gap-2 rounded-sm bg-[#b53029] px-6 py-3 text-[10px] tracking-widest text-white uppercase transition hover:bg-stone-900">
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
    <footer className="relative px-6 py-16 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        {groups.map(([title, links]) => (
          <div key={title}>
            <h3 className="text-[10px] tracking-widest text-stone-900 uppercase">{title}</h3>
            {links.map((link) => <p className="mt-4 text-sm" key={link}>{link}</p>)}
          </div>
        ))}
        <div>
          <h3 className="text-[10px] tracking-widest text-stone-900 uppercase">Newsletter</h3>
          <form
            className="mt-5 flex border-b border-stone-900/20"
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
            <button type="submit" aria-label="Subscribe" className="mt-3 text-stone-500 transition hover:text-[#b53029]">
              <ArrowUpRight size={18} />
            </button>
          </form>
          {subscribed && <p className="mt-3 text-xs text-stone-500">Thanks for subscribing.</p>}
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-stone-900/10 pt-6 text-[10px] tracking-widest text-stone-500 uppercase">
        <p>© {new Date().getFullYear()} NIKA Furniture & Wood Work</p>
        <p>{contact.location}</p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="site-shell text-stone-900">
      <BrandCursor />
      <Header />
      <main>
        <Hero />
        <Signature />
        <NewArrivals />
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
