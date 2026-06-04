import { useState } from 'react'
import type { DocFormat } from '../types'
import { MarkdownRenderer } from './renderers/MarkdownRenderer'
import { JsonRenderer } from './renderers/JsonRenderer'
import { HtmlRenderer } from './renderers/HtmlRenderer'
import { PdfRenderer } from './renderers/PdfRenderer'
import { extractHighlights } from '../lib/highlight'

interface Props {
  format: DocFormat
  content: string
  isBinary: boolean
  historyId: string | null
  onBack: () => void
  onChangeFormat: (f: DocFormat) => void
  onSave: (draft: string, mode: 'overwrite' | 'new', title?: string) => Promise<void>
}

const FORMATS: DocFormat[] = ['markdown', 'json', 'html', 'pdf']

type EditMode = 'read' | 'edit'

export function PreviewScreen({ format, content, isBinary: _isBinary, historyId: _historyId, onBack, onChangeFormat, onSave }: Props) {
  const [scale, setScale] = useState(1)
  const [editMode, setEditMode] = useState<EditMode>('read')
  const [draft, setDraft] = useState(content)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [onlyHighlights, setOnlyHighlights] = useState(false)
  const [exportDialog, setExportDialog] = useState<{ open: boolean; title: string }>({ open: false, title: '' })

  const showZoom = format === 'markdown' || format === 'json'
  const isMarkdown = format === 'markdown'
  const highlightItems = isMarkdown ? extractHighlights(content) : []

  function enterEdit() {
    setDraft(content)
    setEditMode('edit')
    setOnlyHighlights(false)
  }

  function exitEdit() {
    setEditMode('read')
  }

  function openSaveDialog() {
    setSaveTitle('原标题（已编辑）')
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
    wrapSelection(ta, '**', '**', '加粗文字')
  }

  function handleHighlight() {
    const ta = document.querySelector<HTMLTextAreaElement>('.edit-textarea')
    if (!ta) return
    wrapSelection(ta, '==', '==', '高亮文字')
  }

  function openExportDialog() {
    setExportDialog({ open: true, title: '原标题 · 高亮' })
  }

  async function confirmExport() {
    const highlights = extractHighlights(content)
    const exportContent = highlights.map((h) => `- ==${h}==`).join('\n')
    const title = exportDialog.title || '原标题 · 高亮'
    setExportDialog({ open: false, title: '' })
    await onSave(exportContent, 'new', title)
  }

  return (
    <div className="preview-screen">
      <div className="preview-toolbar">
        <button
          onClick={editMode === 'edit' ? exitEdit : onBack}
          aria-label={editMode === 'edit' ? '取消编辑' : '返回'}
        >
          {editMode === 'edit' ? '✕ 取消' : '← 返回'}
        </button>
        {editMode === 'read' && (
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
        )}
        {isMarkdown && editMode === 'read' && (
          <button onClick={enterEdit} aria-label="编辑模式">
            编辑模式
          </button>
        )}
        {isMarkdown && editMode === 'read' && (
          <>
            <button
              onClick={() => setOnlyHighlights((v) => !v)}
              aria-pressed={onlyHighlights}
            >
              {onlyHighlights ? '全文' : '只看高亮'}
            </button>
            {highlightItems.length > 0 && (
              <button onClick={openExportDialog}>导出高亮</button>
            )}
          </>
        )}
        {showZoom && editMode === 'read' && (
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

      {editMode === 'edit' ? (
        <div className="edit-area">
          <div className="edit-toolbar">
            <button onClick={handleBold} aria-label="加粗">
              B 加粗
            </button>
            <button onClick={handleHighlight} aria-label="高亮">
              高亮
            </button>
            <span className="edit-hint">直接打字改原文；选中文字后点上方按钮加粗或高亮</span>
          </div>
          <textarea
            className="edit-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="edit-actions">
            <button className="primary-btn" onClick={openSaveDialog} disabled={!draft.trim()}>
              保存
            </button>
          </div>
          {saveDialogOpen && (
            <div className="save-dialog-overlay">
              <div className="save-dialog">
                <p className="save-dialog-title">保存方式</p>
                <button onClick={confirmOverwrite}>覆盖原条</button>
                <div className="save-dialog-divider">或</div>
                <label className="save-dialog-label" htmlFor="save-title-input">另存为新条</label>
                <input
                  id="save-title-input"
                  className="save-dialog-input"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="标题"
                />
                <button onClick={confirmSaveNew}>另存为新条</button>
                <button onClick={() => setSaveDialogOpen(false)}>取消</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="preview-content"
          style={{ '--doc-scale': scale } as React.CSSProperties}
        >
          {format === 'markdown' && !onlyHighlights && <MarkdownRenderer content={content} />}
          {format === 'markdown' && onlyHighlights && (
            <div className="highlights-only">
              {highlightItems.length === 0 ? (
                <p className="highlights-empty">暂无高亮内容。在编辑模式中选中文字，点「高亮」按钮标记。</p>
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
            ← 返回主页
          </button>
        </div>
      )}

      {exportDialog.open && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <p className="save-dialog-title">导出高亮</p>
            <label className="save-dialog-label" htmlFor="export-title-input">标题</label>
            <input
              id="export-title-input"
              className="save-dialog-input"
              value={exportDialog.title}
              onChange={(e) => setExportDialog((d) => ({ ...d, title: e.target.value }))}
              placeholder="原标题 · 高亮"
            />
            <button onClick={confirmExport}>确认导出</button>
            <button onClick={() => setExportDialog({ open: false, title: '' })}>取消</button>
          </div>
        </div>
      )}
    </div>
  )
}
