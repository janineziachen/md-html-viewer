import { openDB, type DBSchema } from 'idb'
import type { HistoryItem } from '../types'

interface ViewerDB extends DBSchema {
  history: { key: string; value: HistoryItem; indexes: { createdAt: number } }
}

const dbPromise = openDB<ViewerDB>('md-html-viewer', 1, {
  upgrade(db) {
    const store = db.createObjectStore('history', { keyPath: 'id' })
    store.createIndex('createdAt', 'createdAt')
  },
})

export async function addHistory(
  item: Omit<HistoryItem, 'id' | 'createdAt'>,
): Promise<HistoryItem> {
  const full: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  }
  const db = await dbPromise
  await db.put('history', full)
  return full
}

export async function listHistory(): Promise<HistoryItem[]> {
  const db = await dbPromise
  const all = await db.getAllFromIndex('history', 'createdAt')
  return all.reverse()
}

export async function deleteHistory(id: string): Promise<void> {
  const db = await dbPromise
  await db.delete('history', id)
}

export async function clearAllHistory(): Promise<void> {
  const db = await dbPromise
  await db.clear('history')
}
