# MobileMD

在手机浏览器里预览 Markdown / JSON / HTML / PDF 文件与粘贴文本。纯前端 PWA，文件仅在本地处理，不上传任何服务器。

## 功能

- **Markdown**：GFM 表格/任务清单、代码高亮、LaTeX 公式、Mermaid 图表
- **JSON**：可折叠树状视图，解析失败有友好提示
- **HTML**：沙盒 iframe 渲染，移动端自适应；外部链接在新标签打开（详见下方「安全性」）
- **PDF**：翻页 / 缩放浏览
- 粘贴文本自动识别格式；选择本地文件打开；历史记录保存在本地（IndexedDB）
- 深 / 浅色主题（跟随系统，可手动切换）
- 可装到手机主屏，离线使用

## 隐私

所有文件只在你的设备本地处理，不会上传到任何服务器。没有后端、没有账号、没有追踪。

## 安全性

HTML 预览在沙盒 iframe 中渲染，sandbox 权限为 `allow-scripts allow-popups allow-popups-to-escape-sandbox`。这是一个有意的取舍：

- **允许脚本**（`allow-scripts`）：让 HTML 里的 `<script>` 能运行，预览效果更接近真实页面。
- **允许弹窗**（`allow-popups` + `allow-popups-to-escape-sandbox`）：让外部链接能在新标签正常打开。新标签是独立的浏览器上下文，访问不到本应用及其数据。
- **不开同源**（不含 `allow-same-origin`）：这是关键的安全边界。iframe 内的脚本无法把自己当作与本应用同源，因而读不到 localStorage / IndexedDB，也无法操作主页面或窃取数据。

取舍说明：开启 `allow-popups` 后，恶意 HTML 理论上可以弹出广告标签页（弹窗骚扰），但无法借此窃取数据。考虑到本应用是预览你自己信任的文件，这个取舍是划算的——否则外部链接根本无法点击。请勿用它预览来源不明的 HTML。

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm test         # 运行测试
npm run build    # 生产构建
```

## 部署

推送到 `main` 分支后，由 GitHub Actions 自动构建并发布到 GitHub Pages。

> 仓库名需为 `md-html-viewer`，与 `vite.config.ts` 中的 `base` 一致；如改用其他仓库名，请同步修改 `base`。

## 技术栈

React + Vite + TypeScript，react-markdown、pdf.js、vite-plugin-pwa。

## License

MIT
