import type { FurnitureItem, HeroSlide } from '../types/furniture'

export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-dining',
    image: '/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png',
    title: 'Furniture made for your space.',
    description: 'Thoughtfully crafted furniture for beautiful everyday spaces.',
    eyebrow: 'Dining / The Gather Table',
    alt: 'Warm modern dining room with a handcrafted wooden table',
  },
  {
    id: 'hero-detail',
    image: '/images/close_up_architectural_furniture_photography_of_a_modern_minimalist_solid_wood.png',
    title: 'Let the material speak.',
    description: 'Natural grain, quiet forms, and details made to be noticed over time.',
    eyebrow: 'Material / Natural wood',
    alt: 'Close-up of richly grained natural wood furniture',
  },
  {
    id: 'hero-workshop',
    image: '/images/master_woodworking_workshop_editorial_photography_showing_handcrafted_custom.png',
    title: 'Made with care.',
    description: 'Custom woodwork shaped around the way your home is lived in.',
    eyebrow: 'Custom woodwork / The workshop',
    alt: 'Woodworker carefully shaping a piece of furniture in a workshop',
  },
  {
    id: 'hero-home',
    image: '/images/funture4.png',
    title: 'A room begins here.',
    description: 'Furniture with warmth, presence, and a place in everyday life.',
    eyebrow: 'Furniture / Everyday living',
    alt: 'Warm contemporary furniture in a calm interior',
  },
]

export const furnitureItems: FurnitureItem[] = [
  {
    id: 'harbor-bed',
    title: 'The Harbor Bed',
    category: 'Beds',
    description: 'A calm, grounded bedroom piece with clean lines, soft texture, and a deeply restful presence.',
    image: '/images/funture2.png',
    alt: 'Minimal bedroom styling with a contemporary wooden bed frame',
    featured: true,
    backgroundPosition: 'center',
  },
  {
    id: 'gather-table',
    title: 'The Gather Table',
    category: 'Dining Tables',
    description: 'Generous proportions, warm wood grain, and a quietly sculptural silhouette for everyday rituals.',
    image: '/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png',
    alt: 'Handcrafted solid wood dining table in a modern interior',
    featured: true,
    backgroundPosition: 'center',
  },
  {
    id: 'atrium-dining-set',
    title: 'The Atrium Dining Set',
    category: 'Dining Sets',
    description: 'A complete dining composition that brings warmth and structure to open, light-filled rooms.',
    image: '/images/screen.png',
    alt: 'Dining room scene featuring a complete wood furniture set',
    featured: false,
    backgroundPosition: 'center',
  },
  {
    id: 'linea-lounge',
    title: 'The Linea Lounge',
    category: 'Living Room',
    description: 'An inviting living room story shaped around natural materials, comfort, and thoughtful detail.',
    image: '/images/funture4.png',
    alt: 'Warm contemporary living room with layered wood furniture',
    featured: true,
    backgroundPosition: 'center',
  },
  {
    id: 'workshop-detail',
    title: 'Workshop Detail',
    category: 'Custom Woodwork',
    description: 'Crafted joinery, tactile finishes, and bespoke proportions shaped for spaces that deserve character.',
    image: '/images/master_woodworking_workshop_editorial_photography_showing_handcrafted_custom.png',
    alt: 'Woodworker shaping a bespoke furniture piece in the studio',
    featured: true,
    backgroundPosition: 'center',
  },
]

export const collectionImages = {
  beds: '/images/funture2.png',
  diningTables: '/images/editorial_architectural_photography_of_a_bespoke_handcrafted_solid_wood_dining.png',
  diningSets: '/images/screen.png',
  livingRoom: '/images/funture4.png',
  customWoodwork: '/images/master_woodworking_workshop_editorial_photography_showing_handcrafted_custom.png',
}