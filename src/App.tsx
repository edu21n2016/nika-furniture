import { useEffect, useState } from 'react'

const slides = [
  { image: '/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png', alt: 'Handcrafted wood dining table in a modern interior', title: ['CRAFTED FOR', 'MODERN LIVING'], description: 'Furniture shaped by thoughtful design and skilled craftsmanship.' },
  { image: '/images/funture4.png', alt: 'Contemporary furniture in a warm living space', title: ['TIMELESS', 'WOOD CRAFTSMANSHIP'], description: 'Made with attention to material, detail, and lasting quality.' },
  { image: '/images/funture2.png', alt: 'Crafted wooden bedroom furniture', title: ['DESIGNED FOR', 'YOUR SPACE'], description: 'Modern furniture created to bring warmth and character into every space.' },
  { image: '/images/screen.png', alt: 'NIKA furniture showroom interior', title: ['BUILT WITH', 'PURPOSE'], description: 'Thoughtful furniture and wood work made for contemporary living.' },
]

type Category = { name: string; description: string; images: Array<{ src: string; position: string }> }

const categorySource = (src: string, positions: string[]) => positions.map((position) => ({ src, position }))

const categories: Category[] = [
  { name: 'Beds', description: 'Designed for restful spaces.', images: categorySource('/images/funture2.png', ['center', '35% center', '65% center', 'center 68%']) },
  { name: 'Sofas', description: 'Comfort shaped with character.', images: categorySource('/images/funture4.png', ['center', '30% center', '70% center', 'center 65%']) },
  { name: 'Dining Tables', description: 'Made for gathering.', images: categorySource('/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png', ['center', '25% center', '70% center', 'center 68%']) },
  { name: 'Dining Chairs', description: 'Quiet form, everyday comfort.', images: categorySource('/images/screen.png', ['center', '30% center', '72% center', 'center 67%']) },
  { name: 'Wardrobes', description: 'Storage with a refined presence.', images: categorySource('/images/funture3.png', ['center', '28% center', '70% center', 'center 68%']) },
  { name: 'Coffee Tables', description: 'The centre of a considered room.', images: categorySource('/images/close_up_architectural_furniture_photography_of_a_modern_minimalist_solid_wood.png', ['center', '28% center', '72% center', 'center 70%']) },
  { name: 'TV Stands', description: 'Clean lines for modern living.', images: categorySource('/images/screen.png', ['center 35%', '25% center', '75% center', 'center 72%']) },
  { name: 'Office Furniture', description: 'Built for focused work.', images: categorySource('/images/master_woodworking_workshop_editorial_photography_showing_handcrafted_custom.png', ['center', '30% center', '70% center', 'center 66%']) },
]

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setImageIndex((current) => (current + 1) % category.images.length), 4200 + index * 270)
    return () => window.clearInterval(timer)
  }, [category.images.length, index])

  const move = (direction: number) => setImageIndex((current) => (current + direction + category.images.length) % category.images.length)

  return (
    <article className="category-card">
      <div className="category-image">
        {category.images.map((image, imagePosition) => (
          <img className={imagePosition === imageIndex ? 'is-active' : ''} src={image.src} alt={imagePosition === imageIndex ? category.name : ''} style={{ objectPosition: image.position }} key={`${image.src}-${image.position}`} />
        ))}
        <div className="category-shade" />
        <div className="category-controls">
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${category.name} image`}>←</button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${category.name} image`}>→</button>
        </div>
        <div className="category-copy"><h3>{category.name}</h3><p>{category.description}</p></div>
      </div>
    </article>
  )
}

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
            <img src="/images/logow-removebg-preview.png" alt="NIKA" />
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
            <h1 id="hero-title"><span className="title-line">{current.title[0]}</span><em className="title-line">{current.title[1]}</em></h1>
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
        <section className="popular-section" id="furniture" aria-labelledby="popular-title">
          <div className="popular-heading">
            <p>ANIKA / SELECTED COLLECTIONS</p>
            <h2 id="popular-title">MOST POPULAR<br /><em>FURNITURE</em></h2>
            <span>Explore the pieces that define the ANIKA collection.</span>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => <CategoryCard category={category} index={index} key={category.name} />)}
          </div>
        </section>
      </main>
    </div>
  )
}
