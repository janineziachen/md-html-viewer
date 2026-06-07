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
- **iPhone (Safari):** open the link → tap **···** (bottom right) → tap **Share** → scroll down → tap **Add to Home Screen**

After that, a MobileMD icon appears on your home screen. Tap it to open — it works fully offline after the first install.

### Using MobileMD in mainland China

GitHub Pages can be slow or inaccessible on some networks in mainland China. Here is what to expect:

**First install:** You need to access the GitHub Pages URL once to install the app. If the page won't load, try switching to a different network or enabling a VPN just for this step.

**After installing:** You no longer need to access GitHub Pages at all. Once the PWA is installed, every subsequent launch loads entirely from your device's local cache — no network request is made to any server. Opening local files, reading, highlighting, and editing all work completely offline, on mobile data or with no connection at all. The app runs the same whether you are in China or anywhere else in the world.

**In short: install once, use forever — no VPN required after that.**

### Recommended browsers

| Device | Recommended | Avoid |
|--------|-------------|-------|
| iPhone | **Safari** (best), Chrome | WeChat / Weibo in-app browser |
| Android | **Chrome** (best), Edge | Baidu Browser, UC Browser, QQ Browser, WeChat / Weibo in-app browser |
| Desktop | Chrome, Edge, Safari, Firefox | 360 Browser, Sogou Browser |

**Unsupported browsers may show a blank white screen — this is not a bug.** These browsers have incomplete support for modern Web APIs. Switch to Chrome or Safari if the page won't load.

> **Note on mainland China networks:** GitHub Pages may be slow or inaccessible on some networks. This only affects the initial install — see the section above.

### Features

- **Markdown**: GFM tables, task lists, syntax highlighting, LaTeX math, Mermaid diagrams
- **JSON**: collapsible tree view, friendly error message on parse failure
- **HTML**: sandboxed iframe, mobile-responsive; external links open in new tab (see Security below)
- **PDF**: page navigation and zoom
- Paste text with auto format detection; open local files; history saved in IndexedDB
- Reopens where you left off — last document is automatically restored when the app relaunches
- Dark / light theme (follows system, manually switchable)
- Installable PWA with guided install prompt (Android / iOS); works offline

### Privacy

All files are processed locally on your device and never sent to any server. No backend, no account, no tracking.

### Security

**How MobileMD handles your files — and where our responsibility ends**

MobileMD is a fully static app. Once installed, it does not fetch or run any code from the internet on its own — every feature you see was already there when you first opened it. When the app updates, it goes through the normal browser/PWA update process; nothing changes without your knowledge.

Your files are processed entirely on your device. Nothing is uploaded anywhere, and there is no backend to receive it.

---

⚠️ **ONLY OPEN HTML FILES FROM SOURCES YOU TRUST.**

**Do not open HTML files from unknown or unverified sources.** Scripts inside an HTML file run with the same permissions as any website you visit in your browser. A malicious HTML file could:
- Send your device information or IP address to a third-party server without your knowledge
- Display fake login pages designed to steal your account credentials
- Force-open unwanted tabs or redirect you to malicious sites

MobileMD's sandbox prevents these scripts from reading your local files or this app's stored data — but it cannot stop them from making outbound network requests or showing deceptive content inside the preview.

**If you are not sure where an HTML file came from, do not open it.**

---

**Sandbox technical details**

HTML previews are rendered in a sandboxed iframe with `allow-scripts allow-popups allow-popups-to-escape-sandbox`. A deliberate trade-off:

- **Scripts allowed** (`allow-scripts`): lets `<script>` tags in the HTML run, making previews more faithful to the original page.
- **Popups allowed** (`allow-popups` + `allow-popups-to-escape-sandbox`): lets external links open in a new tab. New tabs are isolated browser contexts with no access to this app's data.
- **No same-origin** (no `allow-same-origin`): the key security boundary. Scripts inside the iframe cannot claim the same origin as this app, so they cannot read localStorage / IndexedDB or manipulate the parent page.

Note: with `allow-popups` enabled, a malicious HTML file could theoretically open unwanted tabs, but cannot steal data. Since this app is meant for previewing files you trust, this trade-off is reasonable.

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
- **iPhone（Safari）**：打开链接 → 点击右下角 **···** → 点击「**共享**」→ 向下滑动找到「**添加到主屏幕**」→ 点击添加

添加后主屏幕会出现 MobileMD 图标，点击即可打开——装好之后完全支持离线使用。

### 在中国大陆使用

GitHub Pages 在国内部分网络下访问不稳定，以下是你需要了解的：

**首次安装：** 需要能访问 GitHub Pages 的网络环境（Wi-Fi 或流量均可，访问不了时可临时切换网络或开启代理）。这一步只需要做一次。

**安装之后：** 无需再访问 GitHub Pages，也不需要任何网络连接。PWA 装到桌面后，每次从图标打开都走本地缓存，不向任何服务器发起请求。打开本地文件、阅读、高亮、编辑全程离线运行，用移动数据或完全断网都没问题。无论你在国内还是国外，体验完全一致。

**一句话：装一次，永久可用，之后不需要翻墙。**

### 推荐浏览器

| 设备 | 推荐 | 不推荐 |
|------|------|--------|
| iPhone | **Safari**（首选）、Chrome | 微信/微博内置浏览器 |
| Android | **Chrome**（首选）、Edge | 百度浏览器、UC浏览器、QQ浏览器、微信/微博内置浏览器 |
| 电脑 | Chrome、Edge、Safari、Firefox | 360浏览器、搜狗浏览器 |

**不推荐的浏览器打开后可能白屏或功能异常，这不是网站本身的问题。** 这类浏览器对现代 Web 标准支持不完整，或对部分 API 有额外限制。遇到打不开，换 Chrome 或 Safari 即可。

> **关于国内网络：** GitHub Pages 在部分网络下访问不稳定，这只影响首次安装，安装后与网络无关——详见上方「在中国大陆使用」。

### 功能

- **Markdown**：GFM 表格/任务清单、代码高亮、LaTeX 公式、Mermaid 图表
- **JSON**：可折叠树状视图，解析失败有友好提示
- **HTML**：沙盒 iframe 渲染，移动端自适应；外部链接在新标签打开（详见下方「安全性」）
- **PDF**：翻页 / 缩放浏览
- 粘贴文本自动识别格式；选择本地文件打开；历史记录保存在本地（IndexedDB）
- 重新打开应用时自动恢复上次阅读的文档，无需重新选择
- 深/浅色主题（跟随系统，可手动切换）
- 带安装引导的 PWA（Android / iOS 均支持），支持离线使用

### 隐私

所有文件只在你的设备本地处理，不会上传到任何服务器。没有后端、没有账号、没有追踪。

### 安全性

**MobileMD 如何处理你的文件，以及我们的责任边界**

MobileMD 是一个纯静态应用。安装后，它不会自行从网络加载或执行任何代码——你看到的每一个功能，在你第一次打开时就已经完整地在那里了。应用更新时，走的是正常的浏览器 / PWA 更新流程，不会有任何你不知情的静默变化。

你的文件全程在你的设备上处理，不会上传到任何地方，MobileMD 也没有后端来接收它们。

---

⚠️ **只在确认来源安全的情况下才打开 HTML 文件。**

**不要打开来源不明或不可信的 HTML 文件。** HTML 文件里的脚本拥有与你在浏览器里访问普通网站相同的权限。一个恶意构造的 HTML 文件可能会：
- 在你不知情的情况下，向第三方服务器发送你的设备信息或 IP 地址
- 显示伪造的登录页面，骗取你的账号和密码
- 强行弹出新标签页，或将你引导至恶意网站

MobileMD 的沙盒机制能防止这些脚本读取你的本地文件或本应用存储的数据——但无法阻止它们向外发起网络请求，或在预览区域内显示欺骗性内容。

**如果你不确定一个 HTML 文件的来源，不要打开它。**

---

**沙盒技术细节**

HTML 预览在沙盒 iframe 中渲染，sandbox 权限为 `allow-scripts allow-popups allow-popups-to-escape-sandbox`。这是一个有意的取舍：

- **允许脚本**（`allow-scripts`）：让 HTML 里的 `<script>` 能运行，预览效果更接近真实页面。
- **允许弹窗**（`allow-popups` + `allow-popups-to-escape-sandbox`）：让外部链接能在新标签正常打开。新标签是独立的浏览器上下文，访问不到本应用及其数据。
- **不开同源**（不含 `allow-same-origin`）：关键的安全边界。iframe 内的脚本无法把自己当作与本应用同源，因而读不到 localStorage / IndexedDB，也无法操作主页面或窃取数据。

取舍说明：开启 `allow-popups` 后，恶意 HTML 理论上可以弹出广告标签页（弹窗骚扰），但无法借此窃取数据。考虑到本应用是预览你自己信任的文件，这个取舍是划算的——否则外部链接根本无法点击。

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
