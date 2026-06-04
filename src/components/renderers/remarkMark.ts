/**
 * remarkMark — remark plugin for ==x== → <mark> (modern remark v15/unified v11 compatible).
 *
 * remark-mark-plus@1.0.21 targets the old remark v12 Parser.prototype API and
 * crashes on current remark-parse v11. This plugin uses the unist-util-visit
 * approach instead: it walks text nodes and splits ==...== patterns into
 * mdast nodes with hast data so rehype renders them as <mark>.
 */
import { visit } from 'unist-util-visit'
import type { Root, Text, PhrasingContent, Parent } from 'mdast'

const MARK_RE = /==([^=\n]+)==/g

export default function remarkMark() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (index === undefined || !parent) return

      const value = node.value
      MARK_RE.lastIndex = 0
      if (!MARK_RE.test(value)) return
      MARK_RE.lastIndex = 0

      const nodes: PhrasingContent[] = []
      let last = 0
      let match: RegExpExecArray | null

      while ((match = MARK_RE.exec(value)) !== null) {
        if (match.index > last) {
          nodes.push({ type: 'text', value: value.slice(last, match.index) })
        }
        // Use a 'strong'-shaped node (has children[]) and override hast rendering
        nodes.push({
          type: 'strong',
          children: [{ type: 'text', value: match[1] }],
          data: {
            hName: 'mark',
          },
        } as unknown as PhrasingContent)
        last = match.index + match[0].length
      }

      if (last < value.length) {
        nodes.push({ type: 'text', value: value.slice(last) })
      }

      if (nodes.length > 0) {
        parent.children.splice(index, 1, ...nodes)
      }
    })
  }
}
