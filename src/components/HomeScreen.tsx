import { useRef, useState } from 'react'
import type { DocFormat, HistoryItem } from '../types'
import { detectFromText, detectFromFilename } from '../lib/detectFormat'
import { readTextFile, readBinaryAsDataUrl } from '../lib/readFile'
import { useI18n } from '../lib/i18n'

export interface OpenPayload {
  format: DocFormat
  content: string
  isBinary: boolean
  title: string
}

interface Props {
  onOpen: (p: OpenPayload) => void
  history: HistoryItem[]
  onPick: (item: HistoryItem) => void
  onDelete: (id: string) => void
}

type Tab = 'paste' | 'file'

export function HomeScreen({ onOpen, history, onPick, onDelete }: Props) {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>('paste')
  const [text, setText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  function openPasted() {
    if (!text.trim()) return
    const format = detectFromText(text)
    onOpen({ format, content: text, isBinary: false, title: text.slice(0, 30) })
  }

  async function ingestFile(file: File) {
    const format = detectFromFilename(file.name)
    if (format === 'pdf') {
      const dataUrl = await readBinaryAsDataUrl(file)
      onOpen({ format, content: dataUrl, isBinary: true, title: file.name })
    } else {
      const content = await readTextFile(file)
      onOpen({ format, content, isBinary: false, title: file.name })
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await ingestFile(file)
    e.target.value = ''
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await ingestFile(file)
  }

  return (
    <div className="home-screen">
      <section className="card input-card">
        <div className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'paste'}
            className={tab === 'paste' ? 'tab tab--active' : 'tab'}
            onClick={() => setTab('paste')}
          >
            {t('tab.paste')}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'file'}
            className={tab === 'file' ? 'tab tab--active' : 'tab'}
            onClick={() => setTab('file')}
          >
            {t('tab.file')}
          </button>
        </div>

        {tab === 'paste' ? (
          <div className="tab-panel">
            <textarea
              className="paste-box"
              placeholder={t('paste.placeholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="primary-btn" onClick={openPasted} disabled={!text.trim()}>
              {t('preview')}
            </button>
          </div>
        ) : (
          <div className="tab-panel">
            <div
              className={dragOver ? 'dropzone dropzone--over' : 'dropzone'}
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <span className="dropzone-icon" aria-hidden>
                ⬆
              </span>
              <span className="dropzone-text dropzone-text--touch">{t('dropzone.touch')}</span>
              <span className="dropzone-text dropzone-text--desktop">{t('dropzone.desktop')}</span>
              <span className="dropzone-hint">{t('dropzone.hint')}</span>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept=".md,.markdown,.json,.html,.htm,.pdf"
              hidden
              onChange={handleFile}
            />
          </div>
        )}
      </section>

      <section className="card guide-card">
        <button
          className="guide-toggle"
          aria-expanded={guideOpen}
          onClick={() => setGuideOpen((v) => !v)}
        >
          <span>{t('guide.title')}</span>
          <span className="guide-chevron" aria-hidden>{guideOpen ? '▲' : '▼'}</span>
        </button>
        {guideOpen && (
          <ul className="guide-list">
            <li>{t('guide.paste')}</li>
            <li>{t('guide.file')}</li>
            <li>{t('guide.mark')}</li>
            <li>{t('guide.local')}</li>
          </ul>
        )}
      </section>

      {history.length > 0 && (
        <section className="card history-card">
          <h2 className="card-title">{t('recent')}</h2>
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.id}>
                <button className="history-open" onClick={() => onPick(item)}>
                  <span className="history-format">{item.format}</span>
                  <span className="history-title">{item.title}</span>
                </button>
                <button
                  className="history-del"
                  aria-label={t('delete')}
                  onClick={() => onDelete(item.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
