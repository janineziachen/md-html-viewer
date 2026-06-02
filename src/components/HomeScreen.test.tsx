import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HomeScreen } from './HomeScreen'

describe('HomeScreen', () => {
  it('粘贴文本并打开，回调带识别后的格式', () => {
    const onOpen = vi.fn()
    render(<HomeScreen onOpen={onOpen} history={[]} onPick={() => {}} onDelete={() => {}} />)
    const box = screen.getByPlaceholderText(/把内容粘到这里/)
    fireEvent.change(box, { target: { value: '{"a":1}' } })
    fireEvent.click(screen.getByRole('button', { name: /预览/ }))
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ format: 'json' }))
  })

  it('显示历史列表项', () => {
    render(
      <HomeScreen
        onOpen={() => {}}
        onPick={() => {}}
        onDelete={() => {}}
        history={[
          { id: '1', format: 'markdown', title: '历史A', content: '# a', isBinary: false, createdAt: 1 },
        ]}
      />,
    )
    expect(screen.getByText('历史A')).toBeInTheDocument()
  })
})
