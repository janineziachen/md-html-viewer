import { useEffect, useState } from 'react'
import type { DocFormat, HistoryItem } from './types'
import { HomeScreen, type OpenPayload } from './components/HomeScreen'
import { PreviewScreen } from './components/PreviewScreen'
import { ThemeToggle } from './components/ThemeToggle'
import { ErrorBoundary } from './components/ErrorBoundary'
import { addHistory, listHistory, deleteHistory, updateHistory } from './lib/history'

interface Current {
  id: string | null
  format: DocFormat
  content: string
  isBinary: boolean
  title: string
}

export default function App() {
  const [current, setCurrent] = useState<Current | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  async function refresh() {
    setHistory(await listHistory())
  }
  useEffect(() => {
    void refresh()
  }, [])

  async function open(p: OpenPayload) {
    const saved = await addHistory({ format: p.format, content: p.content, isBinary: p.isBinary, title: p.title })
    setCurrent({ id: saved.id, format: p.format, content: p.content, isBinary: p.isBinary, title: p.title })
    await refresh()
  }

  async function handleSave(draft: string, mode: 'overwrite' | 'new', title?: string) {
    if (mode === 'overwrite' && current!.id) {
      await updateHistory(current!.id, draft)
      setCurrent({ ...current!, content: draft })
    } else {
      const saved = await addHistory({
        format: 'markdown',
        content: draft,
        isBinary: false,
        title: title ?? '已编辑',
      })
      setCurrent({ id: saved.id, format: 'markdown', content: draft, isBinary: false, title: title ?? '已编辑' })
    }
    await refresh()
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">MobileMD</span>
        <ThemeToggle />
      </header>
      {current ? (
        <ErrorBoundary resetKey={`${current.format}:${current.content}`} onReset={() => setCurrent(null)}>
          <PreviewScreen
            format={current.format}
            content={current.content}
            isBinary={current.isBinary}
            historyId={current.id}
            docTitle={current.title}
            onBack={() => setCurrent(null)}
            onChangeFormat={(f) => setCurrent({ ...current, format: f })}
            onSave={handleSave}
          />
        </ErrorBoundary>
      ) : (
        <HomeScreen
          onOpen={open}
          history={history}
          onPick={(item) =>
            setCurrent({ id: item.id, format: item.format, content: item.content, isBinary: item.isBinary, title: item.title })
          }
          onDelete={async (id) => {
            await deleteHistory(id)
            await refresh()
          }}
        />
      )}
    </div>
  )
}
