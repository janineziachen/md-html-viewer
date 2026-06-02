import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('点击在 system→light→dark 间循环并写 data-theme', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /主题/ })
    fireEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    fireEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    fireEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('system')
  })
})
