import 'fake-indexeddb/auto'
import '@testing-library/jest-dom'

// jsdom 缺少 pdf.js 在模块加载期引用的浏览器全局对象，提供最小 stub，
// 让引入 PdfRenderer 的组件测试不在 import 阶段崩溃（真实浏览器不受影响）。
class DOMMatrixStub {
  constructor() {}
}
if (!('DOMMatrix' in globalThis)) {
  ;(globalThis as unknown as { DOMMatrix: unknown }).DOMMatrix = DOMMatrixStub
}
if (!('Path2D' in globalThis)) {
  ;(globalThis as unknown as { Path2D: unknown }).Path2D = class {}
}
if (!('ImageData' in globalThis)) {
  ;(globalThis as unknown as { ImageData: unknown }).ImageData = class {}
}
