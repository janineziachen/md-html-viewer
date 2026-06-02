import { describe, it, expect } from 'vitest'
import { readTextFile, readBinaryAsDataUrl } from './readFile'

describe('readTextFile', () => {
  it('读取文本文件内容', async () => {
    const file = new File(['# hello'], 'a.md', { type: 'text/markdown' })
    const text = await readTextFile(file)
    expect(text).toBe('# hello')
  })
})

describe('readBinaryAsDataUrl', () => {
  it('读取二进制为 dataURL', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'a.pdf', { type: 'application/pdf' })
    const url = await readBinaryAsDataUrl(file)
    expect(url.startsWith('data:application/pdf')).toBe(true)
  })
})
