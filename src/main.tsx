import { createRoot } from 'react-dom/client'
import './index.css'
import { ParticleScene } from './ParticleScene'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <><ParticleScene /><App /></>,
)
