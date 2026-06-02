import { useState } from 'react'

interface Props {
  src?: string
  alt?: string
}

export function SafeImage({ src, alt }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <span className="img-placeholder" role="img" aria-label={alt}>
        图片未找到：{src ?? '(无地址)'}
      </span>
    )
  }

  return <img src={src} alt={alt ?? ''} onError={() => setFailed(true)} />
}
