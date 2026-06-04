import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PdfRenderer } from './PdfRenderer'

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 0,
      getPage: () => Promise.reject(new Error('no canvas in jsdom')),
    }),
  }),
}))

describe('PdfRenderer', () => {
  it('挂载后显示页码工具条', async () => {
    render(<PdfRenderer dataUrl="data:application/pdf;base64,AAAA" />)
    expect(await screen.findByText(/第/)).toBeInTheDocument()
  })

  it('非法 base64 内容不崩溃，显示错误提示', async () => {
    // 复现 bug：把含非法 base64 字符的文本（如 markdown）当 PDF 渲染
    render(<PdfRenderer dataUrl="# 这是 markdown，不是 PDF 内容（含逗号,与中文）" />)
    expect(await screen.findByText(/无法加载 PDF/)).toBeInTheDocument()
  })
})
