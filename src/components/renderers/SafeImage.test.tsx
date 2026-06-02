import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SafeImage } from './SafeImage'

describe('SafeImage', () => {
  it('正常渲染 img', () => {
    render(<SafeImage src="https://x/a.png" alt="图A" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('加载失败时显示占位符并标注路径', () => {
    render(<SafeImage src="./img/missing.png" alt="缺图" />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByText(/图片未找到/)).toBeInTheDocument()
    expect(screen.getByText(/\.\/img\/missing\.png/)).toBeInTheDocument()
  })
})
