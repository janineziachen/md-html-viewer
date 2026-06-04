# Markdown 编辑与高亮提取 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add read/edit mode toggle to the Markdown viewer, with bold/highlight toolbar, save-back to history, "only highlights" view, and "export highlights" as a new history record.

**Architecture:** `PreviewScreen` gains an edit mode (textarea + toolbar) alongside read mode; a new `extractHighlights` pure function powers both the "only highlights" toggle and the "export highlights" action; `App.current` carries the history `id` so edits can overwrite the original record.

**Tech Stack:** React 19, TypeScript, remark-mark-plus (==x== → `<mark>`), idb (IndexedDB), Vitest + @testing-library/react

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/lib/highlight.ts` | Create | `extractHighlights(md)` pure function |
| `src/lib/highlight.test.ts` | Create | Unit tests for extractHighlights |
| `src/lib/history.ts` | Modify | Add `updateHistory(id, content)` |
| `src/lib/history.test.ts` | Modify | Test for updateHistory |
| `src/components/renderers/MarkdownRenderer.tsx` | Modify | Add remark-mark-plus plugin |
| `src/components/renderers/MarkdownRenderer.test.tsx` | Modify | Test ==x== → `<mark>` |
| `src/types.ts` | No change | HistoryItem is fine as-is |
| `src/App.tsx` | Modify | Add `id` to `Current`; pass to PreviewScreen; handle `onSave` |
| `src/App.test.tsx` | Modify | Test save callbacks |
| `src/components/PreviewScreen.tsx` | Modify | Edit/read mode, toolbar, save dialog, only-highlights, export-highlights |
| `src/components/PreviewScreen.test.tsx` | Modify | Integration tests for all new UI flows |
| `src/styles/theme.css` | Modify | Styles for edit toolbar, mark highlight, save dialog |

---

### Task 1: extractHighlights pure function

**Files:**
- Create: `src/lib/highlight.ts`
- Create: `src/lib/highlight.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/highlight.test.ts
import { describe, it, expect } from 'vitest'
import { extractHighlights } from './highlight'

describe('extractHighlights', () => {
  it('returns empty array when no highlights', () => {
    expect(extractHighlights('no highlight here')).toEqual([])
  })

  it('extracts a single highlight', () => {
    expect(extractHighlights('text ==hello world== end')).toEqual(['hello world'])
  })

  it('extracts multiple highlights in order', () => {
    expect(extractHighlights('==first== middle ==second==')).toEqual(['first', 'second'])
  })

  it('handles highlights on separate lines', () => {
    const md = 'line1\n==alpha==\nline2\n==beta=='
    expect(extractHighlights(md)).toEqual(['alpha', 'beta'])
  })

  it('ignores unmatched == markers', () => {
    expect(extractHighlights('== lone marker')).toEqual([])
  })

  it('ignores empty highlights', () => {
    expect(extractHighlights('text ==== end')).toEqual([])
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx vitest run src/lib/highlight.test.ts
```
Expected: FAIL — "Cannot find module './highlight'"

- [ ] **Step 3: Implement extractHighlights**

```typescript
// src/lib/highlight.ts
export function extractHighlights(md: string): string[] {
  const matches = md.matchAll(/==([^=\n]+)==/g)
  return Array.from(matches, (m) => m[1]).filter((s) => s.trim().length > 0)
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
npx vitest run src/lib/highlight.test.ts
```
Expected: all 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/highlight.ts src/lib/highlight.test.ts
git commit -m "feat: extractHighlights pure function"
```

---

### Task 2: updateHistory

**Files:**
- Modify: `src/lib/history.ts`
- Modify: `src/lib/history.test.ts`

- [ ] **Step 1: Write the failing test**

Add this test to the existing `describe('history', ...)` block in `src/lib/history.test.ts`:

```typescript
it('updateHistory 更新内容', async () => {
  const item = await addHistory({ format: 'markdown', title: 't', content: '# old', isBinary: false })
  await updateHistory(item.id, '# new')
  const [updated] = await listHistory()
  expect(updated.content).toBe('# new')
  expect(updated.title).toBe('t')
})
```

Also add `updateHistory` to the import at line 2:
```typescript
import { addHistory, listHistory, deleteHistory, clearAllHistory, updateHistory } from './history'
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx vitest run src/lib/history.test.ts
```
Expected: FAIL — "updateHistory is not a function"

- [ ] **Step 3: Add updateHistory to history.ts**

Add after the `clearAllHistory` function in `src/lib/history.ts`:

```typescript
export async function updateHistory(id: string, content: string): Promise<void> {
  const db = await dbPromise
  const item = await db.get('history', id)
  if (!item) return
  await db.put('history', { ...item, content })
}
```

- [ ] **Step 4: Run to confirm pass**

```bash
npx vitest run src/lib/history.test.ts
```
Expected: all 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/history.ts src/lib/history.test.ts
git commit -m "feat: add updateHistory to history lib"
```

---

### Task 3: ==x== highlight rendering in MarkdownRenderer

**Files:**
- Modify: `src/components/renderers/MarkdownRenderer.tsx`
- Modify: `src/components/renderers/MarkdownRenderer.test.tsx`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Install remark-mark-plus**

```bash
npm install remark-mark-plus@1.0.21
```

- [ ] **Step 2: Write the failing test**

Add to `src/components/renderers/MarkdownRenderer.test.tsx`:

```typescript
it('==x== 渲染成 mark 元素', () => {
  const { container } = render(<MarkdownRenderer content="这是 ==高亮文字== 结束" />)
  const mark = container.querySelector('mark')
  expect(mark).toBeInTheDocument()
  expect(mark?.textContent).toBe('高亮文字')
})
```

- [ ] **Step 3: Run to confirm failure**

```bash
npx vitest run src/components/renderers/MarkdownRenderer.test.tsx
```
Expected: FAIL — `mark` is null

- [ ] **Step 4: Add remark-mark-plus to MarkdownRenderer**

Replace the import block at the top of `src/components/renderers/MarkdownRenderer.tsx`:

```typescript
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkMarkPlus from 'remark-mark-plus'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'
import { SafeImage } from './SafeImage'
import { MermaidBlock } from './MermaidBlock'
```

Then update the `remarkPlugins` line inside the component:

```typescript
remarkPlugins={[remarkGfm, remarkMath, remarkMarkPlus]}
```

- [ ] **Step 5: Add mark styles to theme.css**

Add after the `.markdown-body blockquote` block in `src/styles/theme.css`:

```css
.markdown-body mark {
  background: #fff176;
  color: inherit;
  border-radius: 3px;
  padding: 0 2px;
}
:root[data-theme='dark'] .markdown-body mark {
  background: #7a6500;
  color: #fef08a;
}
@media (prefers-color-scheme: dark) {
  :root[data-theme='system'] .markdown-body mark {
    background: #7a6500;
    color: #fef08a;
  }
}
```

- [ ] **Step 6: Run to confirm pass**

```bash
npx vitest run src/components/renderers/MarkdownRenderer.test.tsx
```
Expected: all 6 tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/renderers/MarkdownRenderer.tsx src/components/renderers/MarkdownRenderer.test.tsx src/styles/theme.css package.json package-lock.json
git commit -m "feat: ==x== 高亮渲染为 mark 元素"
```

---

### Task 4: Thread history id through App → PreviewScreen

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx` (read first)
- Modify: `src/components/PreviewScreen.tsx` (Props only, no behaviour change yet)
- Modify: `src/components/PreviewScreen.test.tsx` (update call sites)

- [ ] **Step 1: Read App.test.tsx**

```bash
cat src/App.test.tsx
```

- [ ] **Step 2: Update App.tsx — add id to Current and pass onSave**

Replace the `Current` interface and related code in `src/App.tsx`:

```typescript
// change interface Current:
interface Current {
  id: string | null   // null when opened from paste (no saved id yet)
  format: DocFormat
  content: string
  isBinary: boolean
}
```

In the `open` function, capture the returned id:
```typescript
async function open(p: OpenPayload) {
  const saved = await addHistory({ format: p.format, content: p.content, isBinary: p.isBinary, title: p.title })
  setCurrent({ id: saved.id, format: p.format, content: p.content, isBinary: p.isBinary })
  await refresh()
}
```

In `onPick`:
```typescript
onPick={(item) =>
  setCurrent({ id: item.id, format: item.format, content: item.content, isBinary: item.isBinary })
}
```

Add `onSave` handler and pass `id` to PreviewScreen (inside the `current ?` branch):
```typescript
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
    setCurrent({ id: saved.id, format: 'markdown', content: draft, isBinary: false })
  }
  await refresh()
}
```

Update the PreviewScreen JSX to pass `historyId` and `onSave`:
```typescript
<PreviewScreen
  format={current.format}
  content={current.content}
  isBinary={current.isBinary}
  historyId={current.id}
  onBack={() => setCurrent(null)}
  onChangeFormat={(f) => setCurrent({ ...current, format: f })}
  onSave={handleSave}
/>
```

Add `updateHistory` to the import:
```typescript
import { addHistory, listHistory, deleteHistory, updateHistory } from './lib/history'
```

- [ ] **Step 3: Update PreviewScreen Props (accept new props, don't wire yet)**

In `src/components/PreviewScreen.tsx`, update the `Props` interface:

```typescript
interface Props {
  format: DocFormat
  content: string
  isBinary: boolean
  historyId: string | null
  onBack: () => void
  onChangeFormat: (f: DocFormat) => void
  onSave: (draft: string, mode: 'overwrite' | 'new', title?: string) => Promise<void>
}
```

Update function signature:
```typescript
export function PreviewScreen({ format, content, isBinary, historyId, onBack, onChangeFormat, onSave }: Props) {
```

- [ ] **Step 4: Fix PreviewScreen.test.tsx call sites**

All existing `render(<PreviewScreen .../>)` calls need `historyId={null}` and `onSave={async () => {}}` added. Update each render in `src/components/PreviewScreen.test.tsx`:

```typescript
// Pattern — add to every PreviewScreen render:
historyId={null}
onSave={async () => {}}
```

- [ ] **Step 5: Run all tests**

```bash
npx vitest run
```
Expected: all existing tests still PASS (no behaviour changed yet)

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/PreviewScreen.tsx src/components/PreviewScreen.test.tsx
git commit -m "refactor: thread historyId + onSave through App → PreviewScreen"
```

---

### Task 5: Edit mode UI in PreviewScreen

**Files:**
- Modify: `src/components/PreviewScreen.tsx`
- Modify: `src/components/PreviewScreen.test.tsx`
- Modify: `src/styles/theme.css`

This task adds the full edit mode: mode toggle, textarea, format toolbar, and save dialog. The save dialog is an inline confirmation (no modal library), rendered conditionally.

- [ ] **Step 1: Write failing tests**

Add to `src/components/PreviewScreen.test.tsx`:

```typescript
import { fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

describe('PreviewScreen edit mode (markdown only)', () => {
  function renderMd(onSave = vi.fn()) {
    return render(
      <PreviewScreen
        format="markdown"
        content="# 标题\n这是 ==高亮== 文字"
        isBinary={false}
        historyId="test-id"
        onBack={() => {}}
        onChangeFormat={() => {}}
        onSave={onSave}
      />,
    )
  }

  it('markdown 视图有「编辑」按钮', () => {
    renderMd()
    expect(screen.getByRole('button', { name: /编辑/ })).toBeInTheDocument()
  })

  it('非 markdown 没有编辑按钮', () => {
    render(
      <PreviewScreen
        format="json"
        content="{}"
        isBinary={false}
        historyId={null}
        onBack={() => {}}
        onChangeFormat={() => {}}
        onSave={async () => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /编辑/ })).not.toBeInTheDocument()
  })

  it('进入编辑模式后显示 textarea', () => {
    renderMd()
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('编辑模式有格式工具栏（加粗、高亮按钮）', () => {
    renderMd()
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    expect(screen.getByRole('button', { name: /加粗/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /高亮/ })).toBeInTheDocument()
  })

  it('点「保存」弹出覆盖/另存选项', () => {
    renderMd()
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    fireEvent.click(screen.getByRole('button', { name: /保存/ }))
    expect(screen.getByRole('button', { name: /覆盖原条/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /另存为新条/ })).toBeInTheDocument()
  })

  it('确认覆盖调用 onSave overwrite', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    renderMd(onSave)
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# 改了' } })
    fireEvent.click(screen.getByRole('button', { name: /保存/ }))
    fireEvent.click(screen.getByRole('button', { name: /覆盖原条/ }))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith('# 改了', 'overwrite', undefined))
  })

  it('另存为新条调用 onSave new 并带标题', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    renderMd(onSave)
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    fireEvent.click(screen.getByRole('button', { name: /保存/ }))
    const titleInput = screen.getByDisplayValue(/已编辑/)
    fireEvent.change(titleInput, { target: { value: '我的新标题' } })
    fireEvent.click(screen.getByRole('button', { name: /另存为新条/ }))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(
      '# 标题\n这是 ==高亮== 文字',
      'new',
      '我的新标题',
    ))
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx vitest run src/components/PreviewScreen.test.tsx
```
Expected: all new tests FAIL

- [ ] **Step 3: Implement edit mode in PreviewScreen.tsx**

Replace the full `PreviewScreen` component body. Keep the existing imports, add these at the top of the file:

```typescript
import { useState } from 'react'
import type { DocFormat } from '../types'
import { MarkdownRenderer } from './renderers/MarkdownRenderer'
import { JsonRenderer } from './renderers/JsonRenderer'
import { HtmlRenderer } from './renderers/HtmlRenderer'
import { PdfRenderer } from './renderers/PdfRenderer'
import { extractHighlights } from '../lib/highlight'
```

Full component (replace the existing function body entirely):

```typescript
type EditMode = 'read' | 'edit'

interface SaveDialogState {
  open: boolean
}

export function PreviewScreen({ format, content, isBinary, historyId, onBack, onChangeFormat, onSave }: Props) {
  const [scale, setScale] = useState(1)
  const [editMode, setEditMode] = useState<EditMode>('read')
  const [draft, setDraft] = useState(content)
  const [saveDialog, setSaveDialog] = useState<SaveDialogState>({ open: false })
  const [saveTitle, setSaveTitle] = useState('')
  const [onlyHighlights, setOnlyHighlights] = useState(false)

  const showZoom = format === 'markdown' || format === 'json'
  const isMarkdown = format === 'markdown'

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
    setSaveDialog({ open: true })
  }

  async function confirmOverwrite() {
    setSaveDialog({ open: false })
    await onSave(draft, 'overwrite', undefined)
    setEditMode('read')
  }

  async function confirmSaveNew() {
    setSaveDialog({ open: false })
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
      // auto-select the placeholder word after React re-renders
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

  async function handleExportHighlights() {
    const highlights = extractHighlights(content)
    if (highlights.length === 0) return
    const exportContent = highlights.map((h) => `- ==  ${h}==`).join('\n')
    await onSave(exportContent, 'new', '原标题 · 高亮')
  }

  const highlightItems = isMarkdown ? extractHighlights(content) : []

  return (
    <div className="preview-screen">
      <div className="preview-toolbar">
        <button onClick={editMode === 'edit' ? exitEdit : onBack} aria-label={editMode === 'edit' ? '取消编辑' : '返回'}>
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
          <button onClick={enterEdit} aria-label="编辑">
            编辑
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
              <button onClick={handleExportHighlights}>导出高亮</button>
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
            <button onClick={handleBold} aria-label="加粗">B 加粗</button>
            <button onClick={handleHighlight} aria-label="高亮">高亮</button>
            <span className="edit-hint">直接打字改原文；选中文字后点上方按钮加粗或高亮</span>
          </div>
          <textarea
            className="edit-textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="edit-actions">
            <button
              className="primary-btn"
              onClick={openSaveDialog}
              disabled={!draft.trim()}
            >
              保存
            </button>
          </div>

          {saveDialog.open && (
            <div className="save-dialog-overlay">
              <div className="save-dialog">
                <p className="save-dialog-title">保存方式</p>
                <button onClick={confirmOverwrite}>覆盖原条</button>
                <div className="save-dialog-divider">或</div>
                <label className="save-dialog-label">另存为新条</label>
                <input
                  className="save-dialog-input"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="标题"
                />
                <button onClick={confirmSaveNew}>另存为新条</button>
                <button onClick={() => setSaveDialog({ open: false })}>取消</button>
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
    </div>
  )
}
```

- [ ] **Step 4: Add edit mode styles to theme.css**

Add after the `.preview-footer` block in `src/styles/theme.css`:

```css
/* ---- Edit mode ---- */
.edit-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px 16px;
  gap: 10px;
}
.edit-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.edit-toolbar button {
  padding: 6px 12px;
  font-size: 14px;
}
.edit-hint {
  font-size: 12px;
  color: var(--muted);
}
.edit-textarea {
  flex: 1;
  min-height: 60vh;
  min-height: 60dvh;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--fg);
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}
.edit-actions {
  display: flex;
  gap: 8px;
}
.save-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.save-dialog {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  width: min(360px, 90vw);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.save-dialog-title {
  margin: 0;
  font-weight: 600;
  font-size: 16px;
}
.save-dialog-divider {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
.save-dialog-label {
  font-size: 13px;
  color: var(--muted);
}
.save-dialog-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--fg);
  font: inherit;
  font-size: 14px;
  box-sizing: border-box;
}
/* ---- Highlights-only view ---- */
.highlights-only {
  padding: 16px;
}
.highlights-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.highlights-list li {
  font-size: 16px;
  line-height: 1.6;
}
.highlights-empty {
  color: var(--muted);
  text-align: center;
  margin-top: 40px;
}
```

- [ ] **Step 5: Run all tests**

```bash
npx vitest run
```
Expected: all tests PASS (including the new edit mode tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/PreviewScreen.tsx src/components/PreviewScreen.test.tsx src/styles/theme.css src/App.tsx
git commit -m "feat: Markdown 编辑模式、工具栏、保存弹窗、只看高亮、导出高亮"
```

---

### Task 6: Export-highlights title prompt

The current `handleExportHighlights` uses a hardcoded title `'原标题 · 高亮'`. The spec says the user should be able to set the title (with a prefill). This task adds a small inline prompt for the export title.

**Files:**
- Modify: `src/components/PreviewScreen.tsx`
- Modify: `src/components/PreviewScreen.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to the edit mode describe block in `src/components/PreviewScreen.test.tsx`:

```typescript
it('导出高亮弹出标题输入框，用户可修改后导出', async () => {
  const onSave = vi.fn().mockResolvedValue(undefined)
  render(
    <PreviewScreen
      format="markdown"
      content="# 标题\n这是 ==高亮== 文字"
      isBinary={false}
      historyId="test-id"
      onBack={() => {}}
      onChangeFormat={() => {}}
      onSave={onSave}
    />,
  )
  fireEvent.click(screen.getByRole('button', { name: /导出高亮/ }))
  const titleInput = screen.getByDisplayValue(/高亮/)
  fireEvent.change(titleInput, { target: { value: '我的高亮集' } })
  fireEvent.click(screen.getByRole('button', { name: /确认导出/ }))
  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      expect.stringContaining('高亮'),
      'new',
      '我的高亮集',
    ),
  )
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx vitest run src/components/PreviewScreen.test.tsx
```
Expected: FAIL — no title input appears after clicking 导出高亮

- [ ] **Step 3: Add export dialog state to PreviewScreen**

In `PreviewScreen`, add a new state variable after the existing states:

```typescript
const [exportDialog, setExportDialog] = useState<{ open: boolean; title: string }>({ open: false, title: '' })
```

Replace `handleExportHighlights`:

```typescript
function openExportDialog() {
  setExportDialog({ open: true, title: '原标题 · 高亮' })
}

async function confirmExport() {
  const highlights = extractHighlights(content)
  const exportContent = highlights.map((h) => `- ==${h}==`).join('\n')
  setExportDialog({ open: false, title: '' })
  await onSave(exportContent, 'new', exportDialog.title || '原标题 · 高亮')
}
```

Change the export button `onClick` to `openExportDialog`:

```typescript
<button onClick={openExportDialog}>导出高亮</button>
```

Add the export dialog JSX inside the read-mode content area (alongside the existing save dialog, or just before the closing `</div>` of the read section):

```typescript
{exportDialog.open && (
  <div className="save-dialog-overlay">
    <div className="save-dialog">
      <p className="save-dialog-title">导出高亮</p>
      <label className="save-dialog-label">标题</label>
      <input
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
```

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```
Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PreviewScreen.tsx src/components/PreviewScreen.test.tsx
git commit -m "feat: 导出高亮弹出标题输入框"
```

---

### Task 7: Final build check

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```
Expected: all tests PASS

- [ ] **Step 2: TypeScript build**

```bash
npm run build
```
Expected: zero TypeScript errors, build completes

- [ ] **Step 3: Commit if build clean**

If `npm run build` emits any TS errors, fix them before committing.

```bash
git add -A
git commit -m "chore: final type fixes for edit/highlight feature"
```
(Only commit if there are actual changes; skip if build was already clean.)
