import { Component, type ReactNode, type ContextType } from 'react'
import { I18nContext } from '../lib/i18n'

interface Props {
  children: ReactNode
  resetKey?: unknown
  onReset?: () => void
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  static contextType = I18nContext
  declare context: ContextType<typeof I18nContext>
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      const t = this.context.t
      return (
        <div className="error-fallback" role="alert">
          <p>{t('error.preview')}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              this.props.onReset?.()
            }}
          >
            {t('back')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
