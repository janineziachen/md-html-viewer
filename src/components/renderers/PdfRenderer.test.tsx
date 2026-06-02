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
})
