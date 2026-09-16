import { useState } from 'react'

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement>

export function ImageWithFallback({ alt, className, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`${className ?? ''} image-placeholder`} role="img" aria-label={alt}>
        <span>Image coming soon</span>
      </div>
    )
  }

  return <img {...props} alt={alt} className={className} onError={() => setFailed(true)} />
}