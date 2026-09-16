import { useState } from 'react'
import { Home } from './pages/Home'
import type { Language } from './types/furniture'

function App() {
  const [language, setLanguage] = useState<Language>('en')
  return <Home language={language} setLanguage={setLanguage} />
}

export default App