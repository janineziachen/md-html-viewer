import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { clearAllHistory } from './lib/history'

describe('App 集成', () => {
  beforeEach(async () => {
    await clearAllHistory()
  })

  it('粘贴 markdown → 预览显示标题 → 返回后历史出现该条', async () => {
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText(/把内容粘到这里/), { target: { value: '# 集成标题' } })
    fireEvent.click(screen.getByRole('button', { name: /预览/ }))
    expect(await screen.findByRole('heading', { name: '集成标题' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '返回' }))
    await waitFor(() => expect(screen.getByText(/# 集成标题/)).toBeInTheDocument())
  })
})
