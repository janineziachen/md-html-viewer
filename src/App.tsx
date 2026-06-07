import { useEffect, useState } from 'react'
import type { DocFormat, HistoryItem } from './types'
import { HomeScreen, type OpenPayload } from './components/HomeScreen'
import { PreviewScreen } from './components/PreviewScreen'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageToggle } from './components/LanguageToggle'
import { ErrorBoundary } from './components/ErrorBoundary'
import { addHistory, listHistory, deleteHistory, updateHistory } from './lib/history'
import { useI18n } from './lib/i18n'

interface Current {
  id: string | null
  format: DocFormat
  content: string
  isBinary: boolean
  title: string
}

export default function App() {
  const { t } = useI18n()
  const [current, setCurrent] = useState<Current | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem('onboarding-done') !== '1' } catch { return false }
  })

  function confirmOnboarding() {
    try { localStorage.setItem('onboarding-done', '1') } catch { /* ignore */ }
    setShowOnboarding(false)
  }

  const LAST_ID_KEY = 'lastOpenId'

  async function refresh() {
    setHistory(await listHistory())
  }
  useEffect(() => {
    async function init() {
      const items = await listHistory()
      setHistory(items)
      const lastId = localStorage.getItem(LAST_ID_KEY)
      if (lastId) {
        const item = items.find((i) => i.id === lastId)
        if (item) setCurrent({ id: item.id, format: item.format, content: item.content, isBinary: item.isBinary, title: item.title })
      }
    }
    void init()
  }, [])

  async function open(p: OpenPayload) {
    const saved = await addHistory({ format: p.format, content: p.content, isBinary: p.isBinary, title: p.title })
    localStorage.setItem(LAST_ID_KEY, saved.id)
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
        title: title ?? t('edited'),
      })
      setCurrent({ id: saved.id, format: 'markdown', content: draft, isBinary: false, title: title ?? t('edited') })
    }
    await refresh()
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">MobileMD</span>
        <div className="header-controls">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {showOnboarding && (
        <div className="save-dialog-overlay">
          <div className="save-dialog onboarding-dialog">
            <h2 className="save-dialog-title">{t('onboarding.title')}</h2>
            <ul className="install-confirm-list">
              <li className="install-confirm-item install-confirm-item--ok">{t('onboarding.p1')}</li>
              <li className="install-confirm-item install-confirm-item--ok">{t('onboarding.p2')}</li>
              <li className="install-confirm-item install-confirm-item--warn">
                <strong>{t('onboarding.p3.title')}</strong><br />
                {t('onboarding.p3.body')}
              </li>
            </ul>
            <button className="primary-btn" onClick={confirmOnboarding}>
              {t('onboarding.ok')}
            </button>
          </div>
        </div>
      )}
      {current ? (
        <ErrorBoundary resetKey={`${current.format}:${current.content}`} onReset={() => setCurrent(null)}>
          <PreviewScreen
            format={current.format}
            content={current.content}
            isBinary={current.isBinary}
            historyId={current.id}
            docTitle={current.title}
            onBack={() => {
              localStorage.removeItem(LAST_ID_KEY)
              setCurrent(null)
            }}
            onChangeFormat={(f) => setCurrent({ ...current, format: f })}
            onSave={handleSave}
          />
        </ErrorBoundary>
      ) : (
        <HomeScreen
          onOpen={open}
          history={history}
          onPick={(item) => {
            localStorage.setItem(LAST_ID_KEY, item.id)
            setCurrent({ id: item.id, format: item.format, content: item.content, isBinary: item.isBinary, title: item.title })
          }}
          onDelete={async (id) => {
            await deleteHistory(id)
            await refresh()
          }}
        />
      )}
    </div>
  )
}
