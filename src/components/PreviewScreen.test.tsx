import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
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

describe('PreviewScreen edit mode (markdown only)', () => {
  function renderMd(onSave = vi.fn()) {
    return render(
      <PreviewScreen
        format="markdown"
        content={"# 标题\n这是 ==高亮== 文字"}
        isBinary={false}
        historyId="test-id"
        onBack={() => {}}
        onChangeFormat={() => {}}
        onSave={onSave}
      />,
    )
  }

  it('markdown 视图有「编辑」按钮', () => {
    renderMd()
    expect(screen.getByRole('button', { name: /编辑/ })).toBeInTheDocument()
  })

  it('非 markdown 没有编辑按钮', () => {
    render(
      <PreviewScreen
        format="json"
        content="{}"
        isBinary={false}
        historyId={null}
        onBack={() => {}}
        onChangeFormat={() => {}}
        onSave={async () => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /编辑/ })).not.toBeInTheDocument()
  })

  it('进入编辑模式后显示 textarea', () => {
    renderMd()
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('编辑模式有格式工具栏（加粗、高亮按钮）', () => {
    renderMd()
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    expect(screen.getByRole('button', { name: /加粗/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /高亮/ })).toBeInTheDocument()
  })

  it('点「保存」弹出覆盖/另存选项', () => {
    renderMd()
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    fireEvent.click(screen.getByRole('button', { name: /保存/ }))
    expect(screen.getByRole('button', { name: /覆盖原条/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /另存为新条/ })).toBeInTheDocument()
  })

  it('确认覆盖调用 onSave overwrite', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    renderMd(onSave)
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# 改了' } })
    fireEvent.click(screen.getByRole('button', { name: /保存/ }))
    fireEvent.click(screen.getByRole('button', { name: /覆盖原条/ }))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith('# 改了', 'overwrite', undefined))
  })

  it('另存为新条调用 onSave new 并带标题', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    renderMd(onSave)
    fireEvent.click(screen.getByRole('button', { name: /编辑/ }))
    fireEvent.click(screen.getByRole('button', { name: /保存/ }))
    const titleInput = screen.getByDisplayValue(/已编辑/)
    fireEvent.change(titleInput, { target: { value: '我的新标题' } })
    fireEvent.click(screen.getByRole('button', { name: /另存为新条/ }))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(
      '# 标题\n这是 ==高亮== 文字',
      'new',
      '我的新标题',
    ))
  })
})
