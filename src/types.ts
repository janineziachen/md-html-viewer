export type DocFormat = 'markdown' | 'json' | 'html' | 'pdf'

export interface HistoryItem {
  id: string
  format: DocFormat
  title: string
  content: string
  isBinary: boolean
  createdAt: number
}
