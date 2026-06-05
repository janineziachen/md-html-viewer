import { useState } from 'react'
import { useI18n } from '../../lib/i18n'

interface Props {
  src?: string
  alt?: string
}

export function SafeImage({ src, alt }: Props) {
  const { t } = useI18n()
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <span className="img-placeholder" role="img" aria-label={alt}>
        {t('img.notFound')}{src ?? t('img.noSrc')}
      </span>
    )
  }

  return <img src={src} alt={alt ?? ''} onError={() => setFailed(true)} />
}
