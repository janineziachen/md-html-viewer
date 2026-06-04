import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HtmlRenderer } from './HtmlRenderer'

describe('HtmlRenderer', () => {
  it('sandbox 允许脚本但不开同源权限', () => {
    const { container } = render(<HtmlRenderer content="<h1>hi</h1>" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe).toBeTruthy()
    const sandbox = iframe.getAttribute('sandbox') ?? ''
    expect(sandbox).toContain('allow-scripts')
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
})
