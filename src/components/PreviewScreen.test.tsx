import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PreviewScreen } from './PreviewScreen'

describe('PreviewScreen', () => {
  it('markdown 分发到标题渲染', () => {
    render(
      <PreviewScreen format="markdown" content="# 标题X" isBinary={false} historyId={null} onSave={async () => {}} onBack={() => {}} onChangeFormat={() => {}} />,
    )
    expect(screen.getByRole('heading', { name: '标题X' })).toBeInTheDocument()
  })

  it('json 分发到 json 渲染', () => {
    render(
      <PreviewScreen format="json" content='{"k":1}' isBinary={false} historyId={null} onSave={async () => {}} onBack={() => {}} onChangeFormat={() => {}} />,
    )
    expect(screen.getAllByText(/k/).length).toBeGreaterThan(0)
  })

  it('点顶部返回触发 onBack', () => {
    let backed = false
    render(
      <PreviewScreen format="markdown" content="# a" isBinary={false} historyId={null} onSave={async () => {}} onBack={() => { backed = true }} onChangeFormat={() => {}} />,
    )
    screen.getByRole('button', { name: '返回' }).click()
    expect(backed).toBe(true)
  })

  it('点底部返回主页触发 onBack', () => {
    let backed = false
    render(
      <PreviewScreen format="markdown" content="# a" isBinary={false} historyId={null} onSave={async () => {}} onBack={() => { backed = true }} onChangeFormat={() => {}} />,
    )
    screen.getByRole('button', { name: '← 返回主页' }).click()
    expect(backed).toBe(true)
  })
})
