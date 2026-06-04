import { describe, it, expect, beforeEach } from 'vitest'
import { addHistory, listHistory, deleteHistory, clearAllHistory, updateHistory } from './history'

describe('history', () => {
  beforeEach(async () => {
    await clearAllHistory()
  })

  it('新增后能列出', async () => {
    await addHistory({ format: 'markdown', title: 't1', content: '# a', isBinary: false })
    const items = await listHistory()
    expect(items.length).toBe(1)
    expect(items[0].title).toBe('t1')
    expect(items[0].id).toBeTruthy()
  })

  it('按时间倒序（最新在前）', async () => {
    await addHistory({ format: 'markdown', title: 'old', content: 'a', isBinary: false })
    await new Promise((r) => setTimeout(r, 5))
    await addHistory({ format: 'json', title: 'new', content: '{}', isBinary: false })
    const items = await listHistory()
    expect(items[0].title).toBe('new')
  })

  it('能删除单条', async () => {
    await addHistory({ format: 'markdown', title: 'x', content: 'a', isBinary: false })
    const [item] = await listHistory()
    await deleteHistory(item.id)
    expect((await listHistory()).length).toBe(0)
  })

  it('updateHistory 更新内容', async () => {
    const item = await addHistory({ format: 'markdown', title: 't', content: '# old', isBinary: false })
    await updateHistory(item.id, '# new')
    const [updated] = await listHistory()
    expect(updated.content).toBe('# new')
    expect(updated.title).toBe('t')
  })
})
