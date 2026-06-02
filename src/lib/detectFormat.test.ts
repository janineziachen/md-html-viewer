import { describe, it, expect } from 'vitest'
import { detectFromText, detectFromFilename } from './detectFormat'

describe('detectFromText', () => {
  it('以 { 开头识别为 json', () => {
    expect(detectFromText('{"a":1}')).toBe('json')
  })
  it('以 [ 开头识别为 json', () => {
    expect(detectFromText('[1,2,3]')).toBe('json')
  })
  it('含 html 标签识别为 html', () => {
    expect(detectFromText('<div>hi</div>')).toBe('html')
  })
  it('含 <!doctype html> 识别为 html', () => {
    expect(detectFromText('<!DOCTYPE html><html></html>')).toBe('html')
  })
  it('其余识别为 markdown', () => {
    expect(detectFromText('# 标题\n正文')).toBe('markdown')
  })
  it('无效 json 文本但以 { 开头仍按 json（用户可手动切）', () => {
    expect(detectFromText('{ not valid')).toBe('json')
  })
})

describe('detectFromFilename', () => {
  it('.md → markdown', () => {
    expect(detectFromFilename('a.md')).toBe('markdown')
  })
  it('.markdown → markdown', () => {
    expect(detectFromFilename('a.markdown')).toBe('markdown')
  })
  it('.json → json', () => {
    expect(detectFromFilename('a.json')).toBe('json')
  })
  it('.html/.htm → html', () => {
    expect(detectFromFilename('a.html')).toBe('html')
    expect(detectFromFilename('a.htm')).toBe('html')
  })
  it('.pdf → pdf', () => {
    expect(detectFromFilename('a.pdf')).toBe('pdf')
  })
  it('未知扩展名默认 markdown', () => {
    expect(detectFromFilename('a.txt')).toBe('markdown')
  })
})
