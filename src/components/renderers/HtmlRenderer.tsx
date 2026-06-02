interface Props {
  content: string
}

export function HtmlRenderer({ content }: Props) {
  return (
    <iframe
      className="html-frame"
      title="html-preview"
      sandbox=""
      srcDoc={content}
    />
  )
}
