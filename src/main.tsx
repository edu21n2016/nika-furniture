import { createRoot } from 'react-dom/client'
import './index.css'

const particleCount = 76

createRoot(document.getElementById('root')!).render(
  <div className="ambient-particles" aria-hidden="true">
    {Array.from({ length: particleCount }, (_, index) => (
      <span
        className={`particle particle-${index % 8} drift-${index % 4} depth-${index % 3}`}
        key={index}
        style={{
          left: `${(index * 29 + 7) % 101}%`,
          top: `${(index * 47 + 11) % 101}%`,
          animationDelay: `${-(index * 1.37)}s`,
        }}
      />
    ))}
  </div>,
)
