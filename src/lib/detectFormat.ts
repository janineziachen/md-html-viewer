import type { DocFormat } from '../types'

export function detectFromText(text: string): DocFormat {
  const t = text.trimStart()
  if (t.startsWith('{') || t.startsWith('[')) return 'json'
  if (/^<!doctype html/i.test(t) || /<(html|div|body|head|p|span|table|h[1-6])[\s>]/i.test(t)) {
    return 'html'
  }
  return 'markdown'
}

export function detectFromFilename(name: string): DocFormat {
  const ext = name.toLowerCase().split('.').pop() ?? ''
  switch (ext) {
    case 'json':
      return 'json'
    case 'html':
    case 'htm':
      return 'html'
    case 'pdf':
      return 'pdf'
    case 'md':
    case 'markdown':
      return 'markdown'
    default:
      return 'markdown'
  }
}
