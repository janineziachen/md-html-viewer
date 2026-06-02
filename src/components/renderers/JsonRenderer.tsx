import { JsonView, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

interface Props {
  content: string
}

export function JsonRenderer({ content }: Props) {
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return (
      <div className="json-error">
        无法解析 JSON。请检查内容格式，或手动切换为其他格式查看。
      </div>
    )
  }
  return (
    <div className="json-body">
      <JsonView data={parsed as object} style={defaultStyles} />
    </div>
  )
}
