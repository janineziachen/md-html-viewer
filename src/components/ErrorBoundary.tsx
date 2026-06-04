import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  resetKey?: unknown
  onReset?: () => void
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
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
      return (
        <div className="error-fallback" role="alert">
          <p>预览这份内容时出错了。可能是格式不匹配或内容有问题。</p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              this.props.onReset?.()
            }}
          >
            返回
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
