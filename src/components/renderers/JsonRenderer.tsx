import { JsonView, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import { useI18n } from '../../lib/i18n'

interface Props {
  content: string
}

export function JsonRenderer({ content }: Props) {
  const { t } = useI18n()
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return (
      <div className="json-error">
        {t('json.error')}
      </div>
    )
  }
  return (
    <div className="json-body">
      <JsonView data={parsed as object} style={defaultStyles} />
    </div>
  )
}
