import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HtmlRenderer } from './HtmlRenderer'

describe('HtmlRenderer', () => {
  it('用 sandbox iframe 且不含 allow-scripts', () => {
    const { container } = render(<HtmlRenderer content="<h1>hi</h1>" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe).toBeTruthy()
    const sandbox = iframe.getAttribute('sandbox') ?? ''
    expect(sandbox).not.toContain('allow-scripts')
  })

  it('把 html 内容写入 srcDoc', () => {
    const { container } = render(<HtmlRenderer content="<p>正文</p>" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('srcdoc')).toContain('<p>正文</p>')
  })
})
