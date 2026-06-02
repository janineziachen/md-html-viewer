import { useEffect, useState } from 'react'
import type { DocFormat, HistoryItem } from './types'
import { HomeScreen, type OpenPayload } from './components/HomeScreen'
import { PreviewScreen } from './components/PreviewScreen'
import { ThemeToggle } from './components/ThemeToggle'
import { addHistory, listHistory, deleteHistory } from './lib/history'

interface Current {
  format: DocFormat
  content: string
  isBinary: boolean
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
    setCurrent({ format: p.format, content: p.content, isBinary: p.isBinary })
    await addHistory({ format: p.format, content: p.content, isBinary: p.isBinary, title: p.title })
    await refresh()
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">MobileMD</span>
        <ThemeToggle />
      </header>
      {current ? (
        <PreviewScreen
          format={current.format}
          content={current.content}
          isBinary={current.isBinary}
          onBack={() => setCurrent(null)}
          onChangeFormat={(f) => setCurrent({ ...current, format: f })}
        />
      ) : (
        <HomeScreen
          onOpen={open}
          history={history}
          onPick={(item) =>
            setCurrent({ format: item.format, content: item.content, isBinary: item.isBinary })
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
