export function extractHighlights(md: string): string[] {
  const matches = md.matchAll(/==([^=\n]+)==/g)
  return Array.from(matches, (m) => m[1]).filter((s) => s.trim().length > 0)
}
