import { useRef, useState } from 'react'
import type { DocFormat, HistoryItem } from '../types'
import { detectFromText, detectFromFilename } from '../lib/detectFormat'
import { readTextFile, readBinaryAsDataUrl } from '../lib/readFile'

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

export function HomeScreen({ onOpen, history, onPick, onDelete }: Props) {
  const [text, setText] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  function openPasted() {
    if (!text.trim()) return
    const format = detectFromText(text)
    onOpen({ format, content: text, isBinary: false, title: text.slice(0, 30) })
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const format = detectFromFilename(file.name)
    if (format === 'pdf') {
      const dataUrl = await readBinaryAsDataUrl(file)
      onOpen({ format, content: dataUrl, isBinary: true, title: file.name })
    } else {
      const content = await readTextFile(file)
      onOpen({ format, content, isBinary: false, title: file.name })
    }
    e.target.value = ''
  }

  return (
    <div className="home-screen">
      <textarea
        className="paste-box"
        placeholder="把内容粘到这里（md / json / html 文本）"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="home-actions">
        <button onClick={openPasted}>预览</button>
        <button onClick={() => fileInput.current?.click()}>选择文件</button>
        <input
          ref={fileInput}
          type="file"
          accept=".md,.markdown,.json,.html,.htm,.pdf"
          hidden
          onChange={handleFile}
        />
      </div>
      <ul className="history-list">
        {history.map((item) => (
          <li key={item.id}>
            <button className="history-open" onClick={() => onPick(item)}>
              <span className="history-format">{item.format}</span>
              <span className="history-title">{item.title}</span>
            </button>
            <button className="history-del" aria-label="删除" onClick={() => onDelete(item.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
