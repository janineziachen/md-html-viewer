interface Props {
  content: string
}

const MOBILE_FIT_STYLE =
  '<style>html{-webkit-text-size-adjust:100%}' +
  'body{margin:8px;overflow-wrap:break-word;word-break:break-word}' +
  'img,video,canvas,svg,iframe{max-width:100%;height:auto}' +
  'pre{white-space:pre-wrap;word-break:break-word}' +
  'table{display:block;max-width:100%;overflow-x:auto}</style>'

function withSafeNav(html: string): string {
  const inject =
    '<base target="_blank">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    MOBILE_FIT_STYLE
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (m) => m + inject)
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (m) => `${m}<head>${inject}</head>`)
  }
  return `<head>${inject}</head>${html}`
}

export function HtmlRenderer({ content }: Props) {
  return (
    <iframe
      className="html-frame"
      title="html-preview"
      sandbox="allow-scripts"
      srcDoc={withSafeNav(content)}
    />
  )
}
