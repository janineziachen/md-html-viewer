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
      </div>
      <div className="preview-content">
        {format === 'markdown' && <MarkdownRenderer content={content} />}
        {format === 'json' && <JsonRenderer content={content} />}
        {format === 'html' && <HtmlRenderer content={content} />}
        {format === 'pdf' && <PdfRenderer dataUrl={content} />}
      </div>
    </div>
  )
}
