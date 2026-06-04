import { useState } from 'react'

interface Props {
  content: string
}

const DESKTOP_WIDTH = 1280

const MOBILE_FIT_STYLE =
  '<style>html{-webkit-text-size-adjust:100%}' +
  'body{margin:8px;overflow-wrap:break-word;word-break:break-word}' +
  'img,video,canvas,svg,iframe{max-width:100%;height:auto}' +
  'pre{white-space:pre-wrap;word-break:break-word}' +
  'table{display:block;max-width:100%;overflow-x:auto}</style>'

const DESKTOP_FIT_STYLE = '<style>img,video{max-width:100%;height:auto}</style>'

function withSafeNav(html: string, desktop: boolean): string {
  const viewport = desktop
    ? `<meta name="viewport" content="width=${DESKTOP_WIDTH}">`
    : '<meta name="viewport" content="width=device-width, initial-scale=1">'
  const inject =
    '<base target="_blank">' + viewport + (desktop ? DESKTOP_FIT_STYLE : MOBILE_FIT_STYLE)
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => m + inject)
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (m) => `${m}<head>${inject}</head>`)
  }
  return `<head>${inject}</head>${html}`
}

export function HtmlRenderer({ content }: Props) {
  const [desktop, setDesktop] = useState(false)
  return (
    <div className="html-view">
      <div className="html-view-bar">
        <button onClick={() => setDesktop((d) => !d)}>
          {desktop ? '切回手机视图' : '桌面宽屏视图'}
        </button>
        <span className="html-view-hint">
          {desktop ? '可左右拖动查看，建议横屏或电脑端查看' : '排版异常？切宽屏，或横屏/电脑端查看'}
        </span>
      </div>
      <div className={desktop ? 'html-frame-wrap html-frame-wrap--desktop' : 'html-frame-wrap'}>
        <iframe
          className="html-frame"
          title="html-preview"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          srcDoc={withSafeNav(content, desktop)}
          style={desktop ? { width: `${DESKTOP_WIDTH}px` } : undefined}
        />
      </div>
    </div>
  )
}
