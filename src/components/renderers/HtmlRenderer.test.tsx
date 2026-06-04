import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { HtmlRenderer } from './HtmlRenderer'

describe('HtmlRenderer', () => {
  it('sandbox 允许脚本与弹窗（外链开新标签）但不开同源权限', () => {
    const { container } = render(<HtmlRenderer content="<h1>hi</h1>" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe).toBeTruthy()
    const sandbox = iframe.getAttribute('sandbox') ?? ''
    expect(sandbox).toContain('allow-scripts')
    expect(sandbox).toContain('allow-popups')
    expect(sandbox).not.toContain('allow-same-origin')
  })

  it('把 html 内容写入 srcDoc', () => {
    const { container } = render(<HtmlRenderer content="<p>正文</p>" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('srcdoc')).toContain('<p>正文</p>')
  })

  it('注入 base target=_blank 防止 iframe 内导航清空预览', () => {
    const { container } = render(
      <HtmlRenderer content="<html><head><title>t</title></head><body><a href='/x'>link</a></body></html>" />,
    )
    const srcdoc = container.querySelector('iframe')!.getAttribute('srcdoc') ?? ''
    expect(srcdoc).toContain('target="_blank"')
  })

  it('无 head/html 标签时也能注入 base', () => {
    const { container } = render(<HtmlRenderer content="<a href='/x'>link</a>" />)
    const srcdoc = container.querySelector('iframe')!.getAttribute('srcdoc') ?? ''
    expect(srcdoc).toContain('target="_blank"')
  })

  it('注入移动端自适应样式，超宽内容不被裁切', () => {
    const { container } = render(<HtmlRenderer content="<div>wide</div>" />)
    const srcdoc = container.querySelector('iframe')!.getAttribute('srcdoc') ?? ''
    expect(srcdoc).toContain('max-width:100%')
    expect(srcdoc).toContain('viewport')
  })

  it('默认手机视图，提供切到桌面宽屏的开关', () => {
    const { getByRole } = render(<HtmlRenderer content="<div>x</div>" />)
    expect(getByRole('button', { name: /桌面/ })).toBeInTheDocument()
  })

  it('切到桌面视图后 iframe 按固定宽屏渲染（可横向滚动）', () => {
    const { container, getByRole } = render(<HtmlRenderer content="<div>x</div>" />)
    fireEvent.click(getByRole('button', { name: /桌面/ }))
    const iframe = container.querySelector('iframe')!
    // 桌面模式下不注入 width=device-width，让页面用自身布局宽度
    expect(iframe.getAttribute('srcdoc')).not.toContain('width=device-width')
    expect(iframe.style.width).toBe('1280px')
  })

  it('提示建议横屏或电脑端查看', () => {
    const { getByText } = render(<HtmlRenderer content="<div>x</div>" />)
    expect(getByText(/电脑端|横屏/)).toBeInTheDocument()
  })
})
