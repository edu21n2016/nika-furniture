import type { Language, TranslationSet } from '../types/furniture'

export const translations: Record<Language, TranslationSet> = {
  en: {
    nav: { home: 'Home', furniture: 'Our Furniture', about: 'About Us', contact: 'Contact', getInTouch: 'Get in Touch' },
    hero: {
      eyebrow: 'Furniture & wood work / Addis Ababa',
      title: 'Furniture made for your space.',
      description: 'NIKA creates considered furniture and custom woodwork for homes and spaces that feel distinctly your own.',
      primary: 'Explore Our Furniture',
      secondary: 'Get in Touch',
    },
    intro: { eyebrow: 'A quieter way to live', title: 'Furniture that gives a room its rhythm.', description: 'NIKA makes pieces to gather around, rest into, and return to. Explore a considered collection of furniture and custom woodwork for everyday spaces.' },
    collections: {
      eyebrow: 'Explore the collection',
      title: 'Pieces with a sense of place.',
      description: 'From the daily rituals around a dining table to the quiet of a bedroom, each collection is designed to live beautifully with you.',
      explore: 'Explore collection',
    },
    featured: {
      eyebrow: 'Selected work',
      title: 'Made to be lived with.',
      description: 'A selection of NIKA pieces that bring natural material, practical design, and a warm point of view into the room.',
      viewCollection: 'View Collection',
    },
    craftsmanship: {
      eyebrow: 'The NIKA approach',
      title: 'Made with care. Designed for life.',
      description: 'Good furniture starts with attention: to the wood, to the way a piece will be used, and to the details that make it feel right. NIKA brings that care to custom woodwork and practical, characterful design.',
      link: 'About our work',
    },
    contact: {
      eyebrow: 'Start a conversation',
      title: "Let's create something beautiful.",
      description: 'Tell us about your space, your needs, or the piece you have in mind. We would love to hear from you.',
      button: 'Contact NIKA',
    },
    social: { eyebrow: 'From the workshop', title: 'NIKA on TikTok', description: 'See the latest furniture, workshop moments, craftsmanship, and new designs.', follow: 'Follow NIKA on TikTok', placeholder: '[TikTok link placeholder]' },
    selected: { eyebrow: '02 / Selected furniture', title: 'See it in the room.', description: 'A closer look at pieces designed for gathering, resting, and making a space your own.', previous: 'Previous furniture', next: 'Next furniture', open: 'Open furniture image', close: 'Close image', viewDetails: 'View collection' },
    footer: {
      description: 'Furniture and wood work for considered spaces.',
      contact: 'Contact details',
      placeholder: '[Phone / email placeholder]',
      rights: '© 2026 NIKA Furnitures and Wood Work. All rights reserved.',
    },
  },
  am: {
    nav: { home: 'መነሻ', furniture: 'የቤት ዕቃዎቻችን', about: 'ስለ እኛ', contact: 'ያግኙን', getInTouch: 'ያግኙን' },
    hero: {
      eyebrow: 'የቤት ዕቃ እና የእንጨት ሥራ / አዲስ አበባ',
      title: 'ለቦታዎ የተሠራ የቤት ዕቃ።',
      description: 'NIKA ለቤቶች እና ለተለያዩ ቦታዎች የሚስማማ የቤት ዕቃ እና የእንጨት ሥራ ይሠራል።',
      primary: 'የቤት ዕቃዎቻችንን ይመልከቱ',
      secondary: 'ያግኙን',
    },
    intro: { eyebrow: 'የተረጋጋ አኗኗር', title: 'ለቦታዎ የራሱን ምት የሚሰጥ የቤት ዕቃ።', description: 'NIKA ለመሰብሰብ፣ ለማረፍ እና በየቀኑ ለመጠቀም የተዘጋጁ ዕቃዎችን ይሠራል። የቤት ዕቃዎቻችንን እና የእንጨት ሥራዎቻችንን ይመልከቱ።' },
    collections: {
      eyebrow: 'ስብስቦቻችንን ይመልከቱ',
      title: 'የቦታዎን ታሪክ የሚያሳዩ ዕቃዎች።',
      description: 'ከምግብ ጠረጴዛ ዕለታዊ ልምድ እስከ መኝታ ቤት ጸጥታ፣ እያንዳንዱ ስብስብ ከእርስዎ ጋር በተፈጥሮ እንዲኖር ተዘጋጅቷል።',
      explore: 'ስብስቡን ይመልከቱ',
    },
    featured: {
      eyebrow: 'የተመረጡ ሥራዎች',
      title: 'ለመኖር የተሠሩ።',
      description: 'የተፈጥሮ ቁሳቁስን፣ ተግባራዊ ንድፍን እና ሞቅ ያለ አመለካከትን ወደ ቦታዎ የሚያመጡ የ NIKA ሥራዎች።',
      viewCollection: 'ስብስቡን ይመልከቱ',
    },
    craftsmanship: {
      eyebrow: 'የ NIKA አቀራረብ',
      title: 'በጥንቃቄ የተሠራ። ለሕይወት የተነደፈ።',
      description: 'ጥሩ የቤት ዕቃ የሚጀምረው በትኩረት ነው፤ ለእንጨቱ፣ ዕቃው ለሚውልበት መንገድ እና ቦታውን ትክክለኛ ለሚያደርጉ ዝርዝሮች። NIKA ይህን ጥንቃቄ ወደ ብጁ የእንጨት ሥራ ያመጣል።',
      link: 'ስለ ሥራችን',
    },
    contact: {
      eyebrow: 'ውይይት እንጀምር',
      title: 'የሚያምር ነገር አብረን እንፍጠር።',
      description: 'ስለ ቦታዎ፣ ፍላጎትዎ ወይም ስለሚያስቡት ዕቃ ይንገሩን። ከእርስዎ መስማት እንወዳለን።',
      button: 'NIKAን ያግኙ',
    },
    social: { eyebrow: 'ከሥራ ቦታችን', title: 'NIKA በTikTok', description: 'የቅርብ ጊዜ የቤት ዕቃዎችን፣ የሥራ ቦታ ጊዜያትን እና አዳዲስ ንድፎችን ይመልከቱ።', follow: 'NIKAን በTikTok ይከተሉ', placeholder: '[የTikTok አገናኝ ቦታ ማስያዣ]' },
    selected: { eyebrow: '02 / የተመረጡ ዕቃዎች', title: 'በቦታው ይመልከቱት።', description: 'ለመሰብሰብ፣ ለማረፍ እና ቦታዎን የራስዎ ለማድረግ የተዘጋጁ ዕቃዎችን በቅርብ ይመልከቱ።', previous: 'ያለፈው ዕቃ', next: 'ቀጣዩ ዕቃ', open: 'የቤት ዕቃ ምስልን ክፈት', close: 'ምስሉን ዝጋ', viewDetails: 'ስብስቡን ይመልከቱ' },
    footer: {
      description: 'ለተመረጡ ቦታዎች የቤት ዕቃ እና የእንጨት ሥራ።',
      contact: 'የመገኛ መረጃ',
      placeholder: '[የስልክ / ኢሜይል ቦታ ማስያዣ]',
      rights: '© 2026 NIKA Furnitures and Wood Work. መብቱ የተጠበቀ ነው።',
    },
  },
}