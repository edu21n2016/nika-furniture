import { useEffect, useState } from 'react'

const slides = [
  { image: '/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png', alt: 'Handcrafted wood dining table in a modern interior', title: ['CRAFTED FOR', 'MODERN LIVING'], description: 'Furniture shaped by thoughtful design and skilled craftsmanship.' },
  { image: '/images/funture4.png', alt: 'Contemporary furniture in a warm living space', title: ['TIMELESS', 'WOOD CRAFTSMANSHIP'], description: 'Made with attention to material, detail, and lasting quality.' },
  { image: '/images/funture2.png', alt: 'Crafted wooden bedroom furniture', title: ['DESIGNED FOR', 'YOUR SPACE'], description: 'Modern furniture created to bring warmth and character into every space.' },
  { image: '/images/screen.png', alt: 'NIKA furniture showroom interior', title: ['BUILT WITH', 'PURPOSE'], description: 'Thoughtful furniture and wood work made for contemporary living.' },
]

export function App() {
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6500)
    return () => window.clearInterval(timer)
  }, [])

  const move = (direction: number) => setSlide((current) => (current + direction + slides.length) % slides.length)
  const current = slides[slide]

  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="navbar" aria-label="Primary navigation">
          <a className="nav-logo" href="#home" aria-label="NIKA Furnitures and Wood Work">
            <img src="/images/nika-logo.png" alt="NIKA" />
          </a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span /><span />
          </button>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {['Home', 'About', 'Furniture', 'Wood Work', 'Contact'].map((item) => <a href={`#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}
            <a className="nav-cta" href="#furniture" onClick={() => setMenuOpen(false)}>Explore Our Work <span>↗</span></a>
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy" key={slide}>
            <p className="hero-kicker">NIKA / FURNITURES &amp; WOOD WORK</p>
            <h1 id="hero-title">{current.title[0]}<br /><em>{current.title[1]}</em></h1>
            <p className="hero-description">{current.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#furniture">Explore Our Work <span>↗</span></a>
              <a className="button button-text" href="#about">Discover NIKA <span>→</span></a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="image-frame">
              {slides.map((item, index) => <img className={index === slide ? 'is-active' : ''} src={item.image} alt={index === slide ? item.alt : ''} key={item.image} />)}
              <div className="image-wash" />
              <div className="image-controls">
                <button type="button" onClick={() => move(-1)} aria-label="Previous image">←</button>
                <span><b>{String(slide + 1).padStart(2, '0')}</b> / {String(slides.length).padStart(2, '0')}</span>
                <button type="button" onClick={() => move(1)} aria-label="Next image">→</button>
              </div>
              <div className="slide-progress"><span style={{ width: `${((slide + 1) / slides.length) * 100}%` }} /></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
