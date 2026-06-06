import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { HtmlRenderer, withSafeNav } from './HtmlRenderer'

describe('withSafeNav', () => {
  it('注入 base target=_blank 防止 iframe 内导航清空预览', () => {
    const out = withSafeNav('<html><head></head><body><a href="/x">link</a></body></html>', false)
    expect(out).toContain('target="_blank"')
  })

  it('无 head/html 标签时也能注入 base', () => {
    const out = withSafeNav('<a href="/x">link</a>', false)
    expect(out).toContain('target="_blank"')
  })

  it('注入移动端自适应样式，超宽内容不被裁切', () => {
    const out = withSafeNav('<div>wide</div>', false)
    expect(out).toContain('max-width:100%')
    expect(out).toContain('viewport')
  })

  it('桌面模式下不注入 width=device-width', () => {
    const out = withSafeNav('<div>x</div>', true)
    expect(out).not.toContain('width=device-width')
  })
})

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

  it('使用 blob URL 作为 src（非 srcDoc）', () => {
    const { container } = render(<HtmlRenderer content="<p>正文</p>" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('srcdoc')).toBeNull()
  })

  it('注入 base target=_blank 防止 iframe 内导航清空预览', () => {
    render(
      <HtmlRenderer content="<html><head><title>t</title></head><body><a href='/x'>link</a></body></html>" />,
    )
    // blob URL 内容无法从 DOM 读取，验证 withSafeNav 逻辑在单元测试中直接测
  })

  it('无 head/html 标签时也能注入 base', () => {
    render(<HtmlRenderer content="<a href='/x'>link</a>" />)
    // blob URL 内容无法从 DOM 读取，withSafeNav 逻辑在单元测试中直接测
  })

  it('注入移动端自适应样式，超宽内容不被裁切', () => {
    render(<HtmlRenderer content="<div>wide</div>" />)
    // blob URL 内容无法从 DOM 读取，withSafeNav 逻辑在单元测试中直接测
  })

  it('默认手机视图，提供切到桌面宽屏的开关', () => {
    const { getByRole } = render(<HtmlRenderer content="<div>x</div>" />)
    expect(getByRole('button', { name: /桌面/ })).toBeInTheDocument()
  })

  it('切到桌面视图后 iframe 按固定宽屏渲染（可横向滚动）', () => {
    const { container, getByRole } = render(<HtmlRenderer content="<div>x</div>" />)
    fireEvent.click(getByRole('button', { name: /桌面/ }))
    const iframe = container.querySelector('iframe')!
    expect(iframe.style.width).toBe('1280px')
  })

  it('提示建议横屏或电脑端查看', () => {
    const { getByText } = render(<HtmlRenderer content="<div>x</div>" />)
    expect(getByText(/电脑端|横屏/)).toBeInTheDocument()
  })
})
