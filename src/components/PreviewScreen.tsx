import { useState, useRef, useLayoutEffect } from 'react'
import type { DocFormat } from '../types'
import { MarkdownRenderer } from './renderers/MarkdownRenderer'
import { JsonRenderer } from './renderers/JsonRenderer'
import { HtmlRenderer } from './renderers/HtmlRenderer'
import { PdfRenderer } from './renderers/PdfRenderer'
import { extractHighlights } from '../lib/highlight'
import { useI18n } from '../lib/i18n'

interface Props {
  format: DocFormat
  content: string
  isBinary: boolean
  historyId: string | null
  docTitle: string
  onBack: () => void
  onChangeFormat: (f: DocFormat) => void
  onSave: (draft: string, mode: 'overwrite' | 'new', title?: string) => Promise<void>
}

const FORMATS: DocFormat[] = ['markdown', 'json', 'html', 'pdf']

type EditMode = 'read' | 'highlight' | 'edit'

export function PreviewScreen({ format, content, isBinary: _isBinary, historyId: _historyId, docTitle, onBack, onChangeFormat, onSave }: Props) {
  const { t } = useI18n()
  const [scale, setScale] = useState(1)
  const [editMode, setEditMode] = useState<EditMode>('read')
  const [draft, setDraft] = useState(content)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveStep, setSaveStep] = useState<'choose' | 'confirm-overwrite' | 'save-new'>('choose')
  const [saveTitle, setSaveTitle] = useState('')
  const [onlyHighlights, setOnlyHighlights] = useState(false)
  const [exportDialog, setExportDialog] = useState<{ open: boolean; title: string }>({ open: false, title: '' })
  // On mobile, touching a button clears the text selection before the click fires.
  // We snapshot the selection on touchstart so applyMarkInSelection can still use it.
  const savedSelectionRef = useRef<string>('')
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Measure preview-toolbar height so sticky sub-toolbars offset correctly even when it wraps
  useLayoutEffect(() => {
    const el = toolbarRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const update = () => {
      document.documentElement.style.setProperty('--toolbar-h', `${el.offsetHeight}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [editMode])

  function saveSelectionOnTouch() {
    const sel = typeof window !== 'undefined' ? window.getSelection() : null
    const text = sel?.toString().trim() ?? ''
    if (text) savedSelectionRef.current = text
  }

  const showZoom = format === 'markdown' || format === 'json'
  const isMarkdown = format === 'markdown'
  const highlightItems = isMarkdown ? extractHighlights(content) : []

  function enterHighlight() {
    setDraft(content)
    setEditMode('highlight')
    setOnlyHighlights(false)
  }

  function enterEdit() {
    setDraft(content)
    setEditMode('edit')
    setOnlyHighlights(false)
  }

  function exitMode() {
    setEditMode('read')
  }

  function applyMarkInSelection(before: string, after: string) {
    const sel = typeof window !== 'undefined' ? window.getSelection() : null
    // Use live selection, or fall back to the touchstart snapshot
    const selected = (sel?.toString().trim() || savedSelectionRef.current).trim()
    savedSelectionRef.current = ''
    if (!selected) return
    const idx = draft.indexOf(selected)
    if (idx === -1) return
    // skip if already wrapped with same marker
    if (
      draft.slice(idx - before.length, idx) === before &&
      draft.slice(idx + selected.length, idx + selected.length + after.length) === after
    ) return
    setDraft(draft.slice(0, idx) + before + selected + after + draft.slice(idx + selected.length))
    sel?.removeAllRanges()
  }

  function openSaveDialog() {
    setSaveStep('choose')
    setSaveDialogOpen(true)
  }

  async function confirmOverwrite() {
    setSaveDialogOpen(false)
    await onSave(draft, 'overwrite', undefined)
    setEditMode('read')
  }

  async function confirmSaveNew() {
    setSaveDialogOpen(false)
    await onSave(draft, 'new', saveTitle)
    setEditMode('read')
  }

  function wrapSelection(textarea: HTMLTextAreaElement, before: string, after: string, placeholder: string) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = draft.slice(start, end)
    if (selected.length > 0) {
      const next = draft.slice(0, start) + before + selected + after + draft.slice(end)
      setDraft(next)
    } else {
      const insert = before + placeholder + after
      const next = draft.slice(0, start) + insert + draft.slice(end)
      setDraft(next)
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length)
      })
    }
  }

  function handleBold() {
    const ta = document.querySelector<HTMLTextAreaElement>('.edit-textarea')
    if (!ta) return
    wrapSelection(ta, '**', '**', t('placeholder.bold'))
  }

  function handleHighlight() {
    const ta = document.querySelector<HTMLTextAreaElement>('.edit-textarea')
    if (!ta) return
    wrapSelection(ta, '==', '==', t('placeholder.highlight'))
  }

  async function confirmExport() {
    const highlights = extractHighlights(content)
    const exportContent = highlights.map((h) => `- ==${h}==`).join('\n')
    const title = exportDialog.title || t('export.fallbackTitle')
    setExportDialog({ open: false, title: '' })
    await onSave(exportContent, 'new', title)
  }

  const isEditingMode = editMode === 'edit' || editMode === 'highlight'

  return (
    <div className="preview-screen">
      <div className="preview-toolbar" ref={toolbarRef}>
        <button
          onClick={isEditingMode ? exitMode : onBack}
          aria-label={isEditingMode ? t('cancel') : t('back')}
        >
          {isEditingMode ? `✕ ${t('cancel')}` : `← ${t('back')}`}
        </button>
        {editMode === 'read' && (
          <select
            value={format}
            onChange={(e) => onChangeFormat(e.target.value as DocFormat)}
            aria-label={t('switchFormat')}
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
        {isMarkdown && editMode === 'read' && (
          <>
            <button onClick={enterHighlight} aria-label={t('highlightMode')}>
              {t('highlightMode')}
            </button>
            <button onClick={enterEdit} aria-label={t('editMode')}>
              {t('editMode')}
            </button>
          </>
        )}
        {isMarkdown && editMode === 'read' && (
          <button
            className={onlyHighlights ? 'btn-active' : undefined}
            onClick={() => setOnlyHighlights((v) => !v)}
            aria-pressed={onlyHighlights}
          >
            {onlyHighlights ? t('fullText') : t('onlyHighlights')}
          </button>
        )}
        {showZoom && editMode === 'read' && (
          <div className="zoom-controls">
            <button
              onClick={() => setScale((s) => Math.max(0.6, Math.round((s - 0.1) * 10) / 10))}
              aria-label={t('zoomOut')}
            >
              A-
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(2.4, Math.round((s + 0.1) * 10) / 10))}
              aria-label={t('zoomIn')}
            >
              A+
            </button>
          </div>
        )}
      </div>

      {editMode === 'highlight' && (
        <div className="highlight-area">
          <div className="highlight-toolbar">
            <button
              onTouchStart={saveSelectionOnTouch}
              onClick={() => applyMarkInSelection('==', '==')}
              aria-label={t('highlightSelected')}
            >
              {t('highlight')}
            </button>
            <button
              onTouchStart={saveSelectionOnTouch}
              onClick={() => applyMarkInSelection('**', '**')}
              aria-label={t('boldSelected')}
            >
              {t('bold')}
            </button>
            <span className="edit-hint">{t('highlightHint')}</span>
            {extractHighlights(draft).length > 0 && (
              <button onClick={() => setExportDialog({ open: true, title: `${docTitle} · ${t('suffix.highlight')}` })}>
                {t('exportHighlights')}
              </button>
            )}
            <button className="primary-btn highlight-save-btn" onClick={openSaveDialog} disabled={draft === content}>
              {t('save')}
            </button>
          </div>
          <div className="preview-content" style={{ '--doc-scale': scale } as React.CSSProperties}>
            <MarkdownRenderer content={draft} />
          </div>
        </div>
      )}

      {editMode === 'edit' && (
        <div className="edit-area">
          <div className="edit-toolbar">
            <button onClick={handleBold} aria-label={t('boldLabel')}>
              {t('bold')}
            </button>
            <button onClick={handleHighlight} aria-label={t('highlight')}>
              {t('highlight')}
            </button>
            <span className="edit-hint">{t('editHint')}</span>
            <button className="primary-btn highlight-save-btn" onClick={openSaveDialog} disabled={!draft.trim()}>
              {t('save')}
            </button>
          </div>
          <textarea
            className="edit-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
      )}

      {editMode === 'read' && (
        <div
          className="preview-content"
          style={{ '--doc-scale': scale } as React.CSSProperties}
        >
          {format === 'markdown' && !onlyHighlights && <MarkdownRenderer content={content} />}
          {format === 'markdown' && onlyHighlights && (
            <div className="highlights-only">
              {highlightItems.length === 0 ? (
                <p className="highlights-empty">{t('noHighlights')}</p>
              ) : (
                <ul className="highlights-list">
                  {highlightItems.map((h, i) => (
                    <li key={i}>
                      <mark>{h}</mark>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {format === 'json' && <JsonRenderer content={content} />}
          {format === 'html' && <HtmlRenderer content={content} />}
          {format === 'pdf' && <PdfRenderer dataUrl={content} />}
        </div>
      )}

      {editMode === 'read' && (
        <div className="preview-footer">
          <button className="back-home" onClick={onBack}>
            ← {t('backHome')}
          </button>
        </div>
      )}

      {saveDialogOpen && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            {saveStep === 'choose' && (
              <>
                <p className="save-dialog-title">{t('saveMethod')}</p>
                <button onClick={() => setSaveStep('confirm-overwrite')}>{t('overwrite')}</button>
                <button onClick={() => {
                  setSaveTitle(`${docTitle} (1)`)
                  setSaveStep('save-new')
                }}>{t('saveAsNew')}</button>
                <button className="save-dialog-cancel" onClick={() => setSaveDialogOpen(false)}>{t('cancel')}</button>
              </>
            )}
            {saveStep === 'confirm-overwrite' && (
              <>
                <p className="save-dialog-title">{t('overwrite')}</p>
                <p className="save-dialog-desc">{t('overwriteDesc')}</p>
                <button className="primary-btn" onClick={confirmOverwrite}>{t('confirmSave')}</button>
                <button onClick={() => setSaveStep('choose')}>{t('cancel')}</button>
              </>
            )}
            {saveStep === 'save-new' && (
              <>
                <p className="save-dialog-title">{t('saveAsNew')}</p>
                <label className="save-dialog-label" htmlFor="save-title-input">{t('fileName')}</label>
                <input
                  id="save-title-input"
                  className="save-dialog-input"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder={`${docTitle} (1)`}
                  autoFocus
                />
                <button className="primary-btn" onClick={confirmSaveNew}>{t('confirm')}</button>
                <button onClick={() => setSaveStep('choose')}>{t('cancel')}</button>
              </>
            )}
          </div>
        </div>
      )}

      {exportDialog.open && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <p className="save-dialog-title">{t('exportHighlights')}</p>
            <label className="save-dialog-label" htmlFor="export-title-input">{t('title')}</label>
            <input
              id="export-title-input"
              className="save-dialog-input"
              value={exportDialog.title}
              onChange={(e) => setExportDialog((d) => ({ ...d, title: e.target.value }))}
              placeholder={`${docTitle} · ${t('suffix.highlight')}`}
            />
            <button onClick={confirmExport}>{t('confirmExport')}</button>
            <button onClick={() => setExportDialog({ open: false, title: '' })}>{t('cancel')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
