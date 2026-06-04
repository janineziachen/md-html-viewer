import { useState } from 'react'
import type { DocFormat } from '../types'
import { MarkdownRenderer } from './renderers/MarkdownRenderer'
import { JsonRenderer } from './renderers/JsonRenderer'
import { HtmlRenderer } from './renderers/HtmlRenderer'
import { PdfRenderer } from './renderers/PdfRenderer'

interface Props {
  format: DocFormat
  content: string
  isBinary: boolean
  onBack: () => void
  onChangeFormat: (f: DocFormat) => void
}

const FORMATS: DocFormat[] = ['markdown', 'json', 'html', 'pdf']

export function PreviewScreen({ format, content, onBack, onChangeFormat }: Props) {
  const [scale, setScale] = useState(1)
  const showZoom = format === 'markdown' || format === 'json'
  return (
    <div className="preview-screen">
      <div className="preview-toolbar">
        <button onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <select
          value={format}
          onChange={(e) => onChangeFormat(e.target.value as DocFormat)}
          aria-label="切换格式"
        >
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        {showZoom && (
          <div className="zoom-controls">
            <button
              onClick={() => setScale((s) => Math.max(0.6, Math.round((s - 0.1) * 10) / 10))}
              aria-label="缩小字体"
            >
              A-
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(2.4, Math.round((s + 0.1) * 10) / 10))}
              aria-label="放大字体"
            >
              A+
            </button>
          </div>
        )}
      </div>
      <div
        className="preview-content"
        style={{ '--doc-scale': scale } as React.CSSProperties}
      >
        {format === 'markdown' && <MarkdownRenderer content={content} />}
        {format === 'json' && <JsonRenderer content={content} />}
        {format === 'html' && <HtmlRenderer content={content} />}
        {format === 'pdf' && <PdfRenderer dataUrl={content} />}
      </div>
    </div>
  )
}
