import { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

interface Props {
  dataUrl: string
}

export function PdfRenderer({ dataUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [scale, setScale] = useState(1.2)
  const docRef = useRef<pdfjs.PDFDocumentProxy | null>(null)

  useEffect(() => {
    let cancelled = false
    const data = atob(dataUrl.split(',')[1] ?? '')
    const bytes = Uint8Array.from(data, (c) => c.charCodeAt(0))
    pdfjs
      .getDocument({ data: bytes })
      .promise.then((doc) => {
        if (cancelled) return
        docRef.current = doc
        setTotal(doc.numPages)
      })
      .catch(() => {})
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
        const viewport = p.getViewport({ scale })
        const canvas = canvasRef.current!
        canvas.width = viewport.width
        canvas.height = viewport.height
        p.render({ canvas, viewport })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [page, scale, total])

  return (
    <div className="pdf-body">
      <div className="pdf-toolbar">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          上一页
        </button>
        <span>
          第 {page} / {total} 页
        </span>
        <button onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page >= total}>
          下一页
        </button>
        <button onClick={() => setScale((s) => s + 0.2)}>放大</button>
        <button onClick={() => setScale((s) => Math.max(0.4, s - 0.2))}>缩小</button>
      </div>
      <canvas ref={canvasRef} className="pdf-canvas" />
    </div>
  )
}
