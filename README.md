# MobileMD

🌐 [English](#english) ・ [中文](#中文)

---

## English

Preview Markdown, JSON, HTML and PDF files in your mobile browser. A pure-frontend PWA — files are processed locally only, never uploaded to any server.

### 👉 Use it now

**Open in Chrome or Safari — nothing to download or install:**

> **https://janineziachen.github.io/md-html-viewer/**

Open the URL on your phone or computer and it just works. To keep it on your phone like a real app:

- **Android (Chrome):** open the link → tap the ⋮ menu (top-right) → **Add to Home screen** / **Install app**
- **iPhone (Safari):** open the link → tap the **Share** button (bottom) → **Add to Home Screen**

After that, a MobileMD icon appears on your home screen. Tap it to open — it also works offline.

### Recommended browsers

| Device | Recommended | Avoid |
|--------|-------------|-------|
| iPhone | **Safari** (best), Chrome | WeChat / Weibo in-app browser |
| Android | **Chrome** (best), Edge | Baidu Browser, UC Browser, QQ Browser, WeChat / Weibo in-app browser |
| Desktop | Chrome, Edge, Safari, Firefox | 360 Browser, Sogou Browser |

**Unsupported browsers may show a blank white screen — this is not a bug.** These browsers have incomplete support for modern Web APIs. Switch to Chrome or Safari if the page won't load.

> GitHub Pages may be unstable on some networks in mainland China. Retry later or switch networks if it won't open.

### Features

- **Markdown**: GFM tables, task lists, syntax highlighting, LaTeX math, Mermaid diagrams
- **JSON**: collapsible tree view, friendly error message on parse failure
- **HTML**: sandboxed iframe, mobile-responsive; external links open in new tab (see Security below)
- **PDF**: page navigation and zoom
- Paste text with auto format detection; open local files; history saved in IndexedDB
- Dark / light theme (follows system, manually switchable)
- Installable PWA, works offline

### Privacy

All files are processed locally on your device and never sent to any server. No backend, no account, no tracking.

### Security

HTML previews are rendered in a sandboxed iframe with `allow-scripts allow-popups allow-popups-to-escape-sandbox`. A deliberate trade-off:

- **Scripts allowed** (`allow-scripts`): lets `<script>` tags in the HTML run, making previews more faithful to the original page.
- **Popups allowed** (`allow-popups` + `allow-popups-to-escape-sandbox`): lets external links open in a new tab. New tabs are isolated browser contexts with no access to this app's data.
- **No same-origin** (no `allow-same-origin`): the key security boundary. Scripts inside the iframe cannot claim the same origin as this app, so they cannot read localStorage / IndexedDB or manipulate the parent page.

Note: with `allow-popups` enabled, a malicious HTML file could theoretically open unwanted tabs, but cannot steal data. Since this app is meant for previewing files you trust, this trade-off is reasonable. **Do not use it to preview untrusted HTML files.**

### Local development

```bash
npm install
npm run dev      # dev server
npm test         # run tests
npm run build    # production build
```

### Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds and publishes to GitHub Pages automatically.

> The repo must be named `md-html-viewer` to match the `base` in `vite.config.ts`. If you rename it, update `base` accordingly.

### Tech stack

React + Vite + TypeScript, react-markdown, pdf.js, vite-plugin-pwa.

### License

MIT

---

## 中文

在手机浏览器里预览 Markdown、JSON、HTML 和 PDF 文件。纯前端 PWA，文件仅在本地处理，不会上传到任何服务器。

### 👉 立即使用

**在 Chrome 或 Safari 中打开，无需下载或安装：**

> **https://janineziachen.github.io/md-html-viewer/**

在手机或电脑上打开上方链接即可使用。如需像真正的 App 一样安装到手机主屏：

- **Android（Chrome）**：打开链接 → 点击右上角 ⋮ → **添加到主屏幕** / **安装应用**
- **iPhone（Safari）**：打开链接 → 点击底部**分享按钮** → **添加到主屏幕**

添加后主屏幕会出现 MobileMD 图标，点击即可打开，支持离线使用。

### 推荐浏览器

| 设备 | 推荐 | 不推荐 |
|------|------|--------|
| iPhone | **Safari**（首选）、Chrome | 微信/微博内置浏览器 |
| Android | **Chrome**（首选）、Edge | 百度浏览器、UC浏览器、QQ浏览器、微信/微博内置浏览器 |
| 电脑 | Chrome、Edge、Safari、Firefox | 360浏览器、搜狗浏览器 |

**不推荐的浏览器打开后可能白屏或功能异常，这不是网站本身的问题。** 这类浏览器对现代 Web 标准支持不完整，或对部分 API 有额外限制。遇到打不开，换 Chrome 或 Safari 即可。

> 在中国大陆部分网络下，GitHub Pages 访问不稳定。打不开时可稍后重试，或切换网络/开启代理。

### 功能

- **Markdown**：GFM 表格/任务清单、代码高亮、LaTeX 公式、Mermaid 图表
- **JSON**：可折叠树状视图，解析失败有友好提示
- **HTML**：沙盒 iframe 渲染，移动端自适应；外部链接在新标签打开（详见下方「安全性」）
- **PDF**：翻页 / 缩放浏览
- 粘贴文本自动识别格式；选择本地文件打开；历史记录保存在本地（IndexedDB）
- 深/浅色主题（跟随系统，可手动切换）
- 可装到手机主屏，离线使用

### 隐私

所有文件只在你的设备本地处理，不会上传到任何服务器。没有后端、没有账号、没有追踪。

### 安全性

HTML 预览在沙盒 iframe 中渲染，sandbox 权限为 `allow-scripts allow-popups allow-popups-to-escape-sandbox`。这是一个有意的取舍：

- **允许脚本**（`allow-scripts`）：让 HTML 里的 `<script>` 能运行，预览效果更接近真实页面。
- **允许弹窗**（`allow-popups` + `allow-popups-to-escape-sandbox`）：让外部链接能在新标签正常打开。新标签是独立的浏览器上下文，访问不到本应用及其数据。
- **不开同源**（不含 `allow-same-origin`）：关键的安全边界。iframe 内的脚本无法把自己当作与本应用同源，因而读不到 localStorage / IndexedDB，也无法操作主页面或窃取数据。

取舍说明：开启 `allow-popups` 后，恶意 HTML 理论上可以弹出广告标签页（弹窗骚扰），但无法借此窃取数据。考虑到本应用是预览你自己信任的文件，这个取舍是划算的——否则外部链接根本无法点击。**请勿用它预览来源不明的 HTML。**

### 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm test         # 运行测试
npm run build    # 生产构建
```

### 部署

推送到 `main` 分支后，由 GitHub Actions 自动构建并发布到 GitHub Pages。

> 仓库名需为 `md-html-viewer`，与 `vite.config.ts` 中的 `base` 一致；如改用其他仓库名，请同步修改 `base`。

### 技术栈

React + Vite + TypeScript，react-markdown、pdf.js、vite-plugin-pwa。

### 许可证

MIT
