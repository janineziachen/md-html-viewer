import { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useI18n } from '../../lib/i18n'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

interface Props {
  dataUrl: string
}

export function PdfRenderer({ dataUrl }: Props) {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [scale, setScale] = useState(1.2)
  const [error, setError] = useState(false)
  const docRef = useRef<pdfjs.PDFDocumentProxy | null>(null)

  useEffect(() => {
    let cancelled = false
    setError(false)
    let bytes: Uint8Array
    try {
      const base64 = dataUrl.split(',')[1] ?? ''
      const data = atob(base64)
      bytes = Uint8Array.from(data, (c) => c.charCodeAt(0))
    } catch {
      setError(true)
      return
    }
    pdfjs
      .getDocument({ data: bytes })
      .promise.then((doc) => {
        if (cancelled) return
        docRef.current = doc
        setTotal(doc.numPages)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [dataUrl])

  useEffect(() => {
    const doc = docRef.current
    if (!doc || !canvasRef.current) return
    let cancelled = false
    doc
      .getPage(page)
      .then((p) => {
        if (cancelled) return
        const dpr = window.devicePixelRatio || 1
        const viewport = p.getViewport({ scale: scale * dpr })
        const canvas = canvasRef.current!
        canvas.width = viewport.width
        canvas.height = viewport.height
        // CSS 显示尺寸跟随 scale（除以 dpr 保持清晰），缩放才可见
        canvas.style.width = `${viewport.width / dpr}px`
        canvas.style.height = `${viewport.height / dpr}px`
        p.render({ canvas, viewport })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [page, scale, total])

  return (
    <div className="pdf-body">
      {error ? (
        <div className="pdf-error">{t('pdf.error')}</div>
      ) : (
        <>
          <div className="pdf-toolbar">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          {t('pdf.prev')}
        </button>
        <span>
          {t('pdf.pageInfo', { page, total })}
        </span>
        <button onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page >= total}>
          {t('pdf.next')}
        </button>
        <button onClick={() => setScale((s) => s + 0.2)}>{t('pdf.zoomIn')}</button>
        <button onClick={() => setScale((s) => Math.max(0.4, s - 0.2))}>{t('pdf.zoomOut')}</button>
          </div>
          <div className="pdf-canvas-wrap">
            <canvas ref={canvasRef} className="pdf-canvas" />
          </div>
        </>
      )}
    </div>
  )
}
