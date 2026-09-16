import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const particleCount = 144

const dustCoordinate = (index: number, seed: number) => {
  const value = Math.sin((index + 1) * seed) * 10000
  return (value - Math.floor(value)) * 100
}

function OpeningSequence() {
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const beginExit = window.setTimeout(() => setLeaving(true), 2500)
    const finish = window.setTimeout(() => setVisible(false), 3250)
    return () => {
      window.clearTimeout(beginExit)
      window.clearTimeout(finish)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`opening-sequence ${leaving ? 'is-leaving' : ''}`} aria-label="NIKA Furnitures and Wood Work">
      <div className="opening-halo" aria-hidden="true" />
      <div className="opening-logo-frame"><img src="/images/nika-logo.png" alt="NIKA" /></div>
      <div className="opening-copy">
        <strong>NIKA</strong>
        <span>FURNITURES AND WOOD WORK</span>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <>
    <div className="ambient-particles" aria-hidden="true">
      {Array.from({ length: particleCount }, (_, index) => (
        <span
          className={`particle particle-${index % 8} drift-${index % 6} depth-${index % 3}`}
          key={index}
          style={{
            left: `${dustCoordinate(index, 12.9898)}%`,
            top: `${dustCoordinate(index, 78.233)}%`,
            animationDelay: `${-(index * 1.37)}s`,
          }}
        />
      ))}
    </div>
    <OpeningSequence />
  </>,
)
