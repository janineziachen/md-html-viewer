import { describe, it, expect } from 'vitest'
import { extractHighlights } from './highlight'

describe('extractHighlights', () => {
  it('returns empty array when no highlights', () => {
    expect(extractHighlights('no highlight here')).toEqual([])
  })

  it('extracts a single highlight', () => {
    expect(extractHighlights('text ==hello world== end')).toEqual(['hello world'])
  })

  it('extracts multiple highlights in order', () => {
    expect(extractHighlights('==first== middle ==second==')).toEqual(['first', 'second'])
  })

  it('handles highlights on separate lines', () => {
    const md = 'line1\n==alpha==\nline2\n==beta=='
    expect(extractHighlights(md)).toEqual(['alpha', 'beta'])
  })

  it('ignores unmatched == markers', () => {
    expect(extractHighlights('== lone marker')).toEqual([])
  })

  it('ignores empty highlights', () => {
    expect(extractHighlights('text ==== end')).toEqual([])
  })
})
