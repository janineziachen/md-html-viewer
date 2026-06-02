import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('渲染标题', () => {
    render(<MarkdownRenderer content="# 你好" />)
    expect(screen.getByRole('heading', { name: '你好' })).toBeInTheDocument()
  })

  it('渲染 GFM 表格', () => {
    const md = '| a | b |\n|---|---|\n| 1 | 2 |'
    render(<MarkdownRenderer content={md} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('渲染任务清单', () => {
    render(<MarkdownRenderer content={'- [x] 完成\n- [ ] 未完成'} />)
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes.length).toBe(2)
  })

  it('图片使用 SafeImage（带 alt）', () => {
    render(<MarkdownRenderer content={'![图A](https://x/a.png)'} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
