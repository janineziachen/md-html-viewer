import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JsonRenderer } from './JsonRenderer'

describe('JsonRenderer', () => {
  it('合法 json 渲染出 key', () => {
    render(<JsonRenderer content='{"name":"啾啾","age":3}' />)
    expect(screen.getByText(/name/)).toBeInTheDocument()
  })

  it('非法 json 显示错误提示而非崩溃', () => {
    render(<JsonRenderer content='{ not valid' />)
    expect(screen.getByText(/无法解析/)).toBeInTheDocument()
  })
})
