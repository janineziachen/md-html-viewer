# MobileMD

在手机浏览器里预览 Markdown / JSON / HTML / PDF 文件与粘贴文本。纯前端 PWA，文件仅在本地处理，不上传任何服务器。

## 功能

- **Markdown**：GFM 表格/任务清单、代码高亮、LaTeX 公式、Mermaid 图表
- **JSON**：可折叠树状视图，解析失败有友好提示
- **HTML**：沙盒渲染（禁脚本，只看排版与样式）
- **PDF**：翻页 / 缩放浏览
- 粘贴文本自动识别格式；选择本地文件打开；历史记录保存在本地（IndexedDB）
- 深 / 浅色主题（跟随系统，可手动切换）
- 可装到手机主屏，离线使用

## 隐私

所有文件只在你的设备本地处理，不会上传到任何服务器。没有后端、没有账号、没有追踪。

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
