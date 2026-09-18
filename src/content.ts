// Central content source for the NIKA showroom homepage (V1 — no e-commerce).
// Every user-facing string lives here so copy regressions are observable from
// content.check.js rather than buried inside JSX.

export type Item = { title: string; text: string; image: string }

export type HeroSlide = {
  image: string
  eyebrow: string
  title: [string, string]
  copy: string
}

export type Caption = [image: string, label: string]

export const navItems = ['Home', 'About', 'Furniture', 'Wood Work', 'Contact'] as const

export const furniture: Item[] = [
  { title: 'Sofas', text: 'Comfort shaped with character.', image: '/images/funture4.png' },
  { title: 'Beds', text: 'Designed for restful spaces.', image: '/images/funture2.png' },
  { title: 'Dining', text: 'Made for gathering.', image: '/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png' },
  { title: 'Wood Work', text: 'Crafted with precision.', image: '/images/master_woodworking_workshop_editorial_photography_showing_handcrafted_custom.png' },
  { title: 'Tables', text: 'Form, function and detail.', image: '/images/close_up_architectural_furniture_photography_of_a_modern_minimalist_solid_wood.png' },
]

export const heroSlides: HeroSlide[] = [
  { image: furniture[2].image, eyebrow: 'ANIKA / FURNITURE & WOODWORK', title: ['DESIGNED FOR', 'YOUR SPACE.'], copy: 'Furniture shaped by thoughtful design, quality materials, and skilled craftsmanship.' },
  { image: furniture[0].image, eyebrow: 'THE LIVING COLLECTION', title: ['TIMELESS', 'WOOD CRAFTSMANSHIP'], copy: 'Warm materials, considered proportions, and enduring comfort.' },
  { image: furniture[1].image, eyebrow: 'MADE FOR YOUR SPACE', title: ['BUILT WITH', 'PURPOSE'], copy: 'Thoughtful furniture and woodwork for contemporary living.' },
]

// Signature Pieces — asymmetric editorial gallery tiles.
export const signaturePieces: Item[] = [
  { title: 'Linen Lounge Sofa', text: 'Upholstery / Solid frame', image: furniture[0].image },
  { title: 'Quiet Frame Bed', text: 'Walnut / Hand finished', image: furniture[1].image },
  { title: 'Bespoke Dining Table', text: 'Solid wood / Made to order', image: furniture[2].image },
  { title: 'Carved Detailing', text: 'Workshop / By hand', image: furniture[3].image },
  { title: 'Minimalist Sideboard', text: 'Oak / Oil finish', image: furniture[4].image },
]

// Latest Creations — recent projects, not products.
export const latestCreations: Item[] = [
  { title: 'The Addis Dining Room', text: 'A full dining commission in solid walnut.', image: furniture[2].image },
  { title: 'Walnut Sideboard Study', text: 'Storage designed around an existing room.', image: furniture[4].image },
  { title: 'Workshop Series No. 4', text: 'Hand-carved detailing from the bench.', image: furniture[3].image },
]

export const craftsmanshipSteps: Item[] = [
  { title: '01 — SELECT', text: 'Carefully selected materials', image: furniture[3].image },
  { title: '02 — CRAFT', text: 'Skilled woodworking and construction', image: furniture[4].image },
  { title: '03 — FINISH', text: 'Careful finishing and attention to detail', image: furniture[2].image },
]

// Placeholder-safe counters: confirm with the client before publishing figures.
export const achievements: Array<[value: string, label: string]> = [
  ['—', 'Years of Craftsmanship'],
  ['—', 'Completed Projects'],
  ['—', 'Clients'],
  ['—', 'Collections & Designs'],
]

export const workshopCaptions: Caption[] = [
  [furniture[3].image, 'Hand-carving detail'],
  [furniture[0].image, 'Living room reveal'],
  [furniture[4].image, 'Oil finish process'],
  [furniture[2].image, 'Material selection'],
]

export const contact = {
  heading: "LET'S CREATE SOMETHING BEAUTIFUL.",
  supporting: "From statement furniture to custom woodwork, let's create something made for your space.",
  phone: '+251 (0) 000 000 000',
  email: 'studio@anikafurniture.com',
  location: 'Addis Ababa, Ethiopia',
  hours: 'Monday – Saturday, 9:00 AM – 6:00 PM · By appointment',
}

// Note: the V1 commerce-wording guard list now lives in src/content.check.js,
// which scans this file so the banned terms never need to be stored here.
