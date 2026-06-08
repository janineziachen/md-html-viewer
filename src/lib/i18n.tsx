import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

type Vars = Record<string, string | number>

const zh = {
  'tab.paste': '粘贴文本',
  'tab.file': '导入文件',
  'paste.placeholder': '把内容粘到这里（md / json / html 文本）',
  'preview': '预览',
  'dropzone.touch': '点此选择文件',
  'dropzone.desktop': '拖入文件，或点此选择',
  'dropzone.hint': '支持 md / json / html / pdf',
  'recent': '最近浏览',
  'delete': '删除',
  'guide.title': '使用说明',
  'guide.paste': '「粘贴文本」：贴入 md / json / html 文本后点「预览」',
  'guide.file': '「导入文件」：打开本地 md / json / html / pdf 文件',
  'guide.mark': '在 Markdown 里可划选文字「高亮」或「加粗」',
  'guide.local': '所有内容只存在你的设备上，不会上传',
  'cancel': '取消',
  'back': '返回',
  'switchFormat': '切换格式',
  'highlightMode': '高亮模式',
  'editMode': '编辑模式',
  'fullText': '全文',
  'onlyHighlights': '只看高亮',
  'zoomOut': '缩小字体',
  'zoomIn': '放大字体',
  'highlightSelected': '高亮选中文字',
  'highlight': '高亮',
  'boldSelected': '加粗选中文字',
  'bold': 'B 加粗',
  'highlightHint': '划选文字后点「高亮」或「加粗」标记',
  'exportHighlights': '导出高亮',
  'save': '保存',
  'boldLabel': '加粗',
  'editHint': '直接打字改原文；选中后点按钮加粗或高亮',
  'noHighlights': '暂无高亮内容。进入「高亮模式」划选文字后点「高亮」按钮标记。',
  'backHome': '返回主页',
  'saveMethod': '保存方式',
  'overwrite': '覆盖原条',
  'saveAsNew': '另存为新条',
  'overwriteDesc': '将用当前内容直接覆盖保存，无法撤销。',
  'confirmSave': '确定保存',
  'fileName': '文件名称',
  'confirm': '确定',
  'title': '标题',
  'confirmExport': '确认导出',
  'suffix.highlight': '高亮',
  'placeholder.bold': '加粗文字',
  'placeholder.highlight': '高亮文字',
  'export.fallbackTitle': '原标题 · 高亮',
  'edited': '已编辑',
  'theme.system': '跟随系统',
  'theme.light': '浅色',
  'theme.dark': '深色',
  'theme.label': '主题切换',
  'lang.label': '语言切换',
  'error.preview': '预览这份内容时出错了。可能是格式不匹配或内容有问题。',
  'html.toMobile': '切回手机视图',
  'html.toDesktop': '桌面宽屏视图',
  'html.desktopHint': '可左右拖动查看，建议横屏或电脑端查看',
  'html.mobileHint': '排版异常？切宽屏，或横屏/电脑端查看',
  'pdf.error': '无法加载 PDF。该内容可能不是有效的 PDF 文件。',
  'pdf.prev': '上一页',
  'pdf.next': '下一页',
  'pdf.zoomIn': '放大',
  'pdf.zoomOut': '缩小',
  'pdf.pageInfo': '第 {page} / {total} 页',
  'json.error': '无法解析 JSON。请检查内容格式，或手动切换为其他格式查看。',
  'img.notFound': '图片未找到：',
  'img.noSrc': '(无地址)',
  'install.action': '添加到主屏幕',
  'install.dismiss': '不了',
  'install.invite': '安装到桌面，国内离线可用',
  'install.howto': '如何安装',
  'install.guide.title': '安装到桌面',
  'install.guide.safe': '放心安装。这个操作在技术上相当于把一个网页以全屏方式存为书签，由浏览器负责运行，不会触碰你手机的联系人、相机、麦克风或其他系统资源。想删除时，长按图标选「删除」即可，不留任何痕迹。',
  'install.guide.not-app': '这不是安装新 App——只是在桌面创建一个快速入口。点击后以全屏方式打开，像 App 一样使用，但无需通过应用商店，也不占用太多存储空间。',
  'install.guide.benefit': '装好后，每次从图标打开完全走本地缓存——无需网络，国内无需翻墙，打开即用。',
  'install.guide.ios.label': '📱 iPhone',
  'install.guide.ios.safari': 'Safari：点底部分享按钮（⬆）或右下角 ··· → 共享 → 向下滑动 → 添加到主屏幕 → 添加',
  'install.guide.ios.chrome': 'Chrome（iOS 17+）：点右上角 ··· → 添加到主屏幕',
  'install.guide.android.label': '🤖 Android',
  'install.guide.android.chrome': 'Chrome / Edge：点右上角 ⋮ → 添加到主屏幕 / 安装应用',
  'install.guide.android.samsung': '三星浏览器：右下角 ≡ → 添加页面到 → 主屏幕',
  'install.guide.ok': '知道了',
  'onboarding.title': '开始之前，了解一下',
  'onboarding.p1': '你的所有文件只在你的设备上处理，不会上传到任何服务器。MobileMD 没有后端、没有账号、没有追踪。',
  'onboarding.p2': 'MobileMD 本身不从网络动态加载代码，你使用的功能就是你安装时的版本，不会悄悄改变。',
  'onboarding.p3.title': '关于 HTML 文件，请务必注意：',
  'onboarding.p3.body': 'HTML 文件里的脚本会在你的设备本地执行，其权限与你在浏览器里打开任意网页相同。恶意构造的 HTML 可能窃取信息、显示钓鱼内容或弹出恶意页面。MobileMD 无法审查你导入的 HTML 内容，请只打开你完全信任来源的 HTML 文件。',
  'onboarding.ok': '我已了解，开始使用',
}

type Key = keyof typeof zh

const en: Record<Key, string> = {
  'tab.paste': 'Paste',
  'tab.file': 'File',
  'paste.placeholder': 'Paste your text here (md / json / html)',
  'preview': 'Preview',
  'dropzone.touch': 'Choose a file',
  'dropzone.desktop': 'Drop a file, or click to choose',
  'dropzone.hint': 'Supports md / json / html / pdf',
  'recent': 'Recent',
  'delete': 'Delete',
  'guide.title': 'How to use',
  'guide.paste': 'Paste tab: paste md / json / html text, then tap Preview',
  'guide.file': 'File tab: open a local md / json / html / pdf file',
  'guide.mark': 'In Markdown, select text to Highlight or make it Bold',
  'guide.local': 'Everything stays on your device — nothing is uploaded',
  'cancel': 'Cancel',
  'back': 'Back',
  'switchFormat': 'Switch format',
  'highlightMode': 'Highlight',
  'editMode': 'Edit',
  'fullText': 'Full text',
  'onlyHighlights': 'Highlights only',
  'zoomOut': 'Smaller text',
  'zoomIn': 'Larger text',
  'highlightSelected': 'Highlight selection',
  'highlight': 'Highlight',
  'boldSelected': 'Bold selection',
  'bold': 'B Bold',
  'highlightHint': 'Select text, then tap Highlight or Bold',
  'exportHighlights': 'Export highlights',
  'save': 'Save',
  'boldLabel': 'Bold',
  'editHint': 'Type to edit; select text then tap Bold or Highlight',
  'noHighlights': 'No highlights yet. Enter Highlight mode, select text and tap Highlight.',
  'backHome': 'Back to home',
  'saveMethod': 'Save as',
  'overwrite': 'Overwrite',
  'saveAsNew': 'Save as new',
  'overwriteDesc': 'This overwrites the original and cannot be undone.',
  'confirmSave': 'Save',
  'fileName': 'File name',
  'confirm': 'OK',
  'title': 'Title',
  'confirmExport': 'Export',
  'suffix.highlight': 'highlights',
  'placeholder.bold': 'bold text',
  'placeholder.highlight': 'highlighted text',
  'export.fallbackTitle': 'Untitled · highlights',
  'edited': 'Edited',
  'theme.system': 'System',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.label': 'Toggle theme',
  'lang.label': 'Switch language',
  'error.preview': 'Something went wrong rendering this. The format may not match, or the content may be invalid.',
  'html.toMobile': 'Mobile view',
  'html.toDesktop': 'Desktop view',
  'html.desktopHint': 'Drag sideways to view; landscape or desktop recommended',
  'html.mobileHint': 'Layout off? Try desktop view, landscape or a computer',
  'pdf.error': 'Could not load the PDF. The content may not be a valid PDF file.',
  'pdf.prev': 'Prev',
  'pdf.next': 'Next',
  'pdf.zoomIn': 'Zoom in',
  'pdf.zoomOut': 'Zoom out',
  'pdf.pageInfo': 'Page {page} / {total}',
  'json.error': 'Could not parse JSON. Check the format, or switch to another format.',
  'img.notFound': 'Image not found: ',
  'img.noSrc': '(no source)',
  'install.action': 'Add to Home Screen',
  'install.dismiss': 'Not now',
  'install.invite': 'Install for offline use — no VPN needed',
  'install.howto': 'How to install',
  'install.guide.title': 'Add to Home Screen',
  'install.guide.safe': "You're safe to install. Technically, this is just saving a full-screen bookmark — the browser handles everything. It cannot access your contacts, camera, microphone, or any other system resource. To remove it, long-press the icon and delete, just like any app icon. No files left behind.",
  'install.guide.not-app': "This doesn't install a new app — it just creates a shortcut on your home screen. It opens full-screen like a native app, but requires no app store and uses minimal storage.",
  'install.guide.benefit': 'Once added, every launch loads from local cache — no internet needed, no VPN required, works anywhere.',
  'install.guide.ios.label': '📱 iPhone',
  'install.guide.ios.safari': 'Safari: tap the Share button (⬆) at the bottom or ··· (bottom right) → Share → scroll down → Add to Home Screen → Add',
  'install.guide.ios.chrome': 'Chrome (iOS 17+): tap ··· (top right) → Add to Home Screen',
  'install.guide.android.label': '🤖 Android',
  'install.guide.android.chrome': 'Chrome / Edge: tap ⋮ (top right) → Add to Home screen / Install app',
  'install.guide.android.samsung': 'Samsung Internet: tap ≡ (bottom right) → Add page to → Home screen',
  'install.guide.ok': 'Got it',
  'onboarding.title': 'Before you begin',
  'onboarding.p1': 'All your files are processed on your device only — nothing is uploaded to any server. No backend, no account, no tracking.',
  'onboarding.p2': 'MobileMD does not load dynamic code from the internet. The features you see are exactly what was there when you installed it — nothing changes silently.',
  'onboarding.p3.title': 'Important note on HTML files:',
  'onboarding.p3.body': 'Scripts inside an HTML file run locally on your device with the same permissions as any website you visit. A malicious HTML file could steal information, display phishing content, or open unwanted pages. MobileMD cannot inspect the content of files you import — only open HTML from sources you fully trust.',
  'onboarding.ok': "I understand, let's go",
}

const DICT: Record<Lang, Record<Key, string>> = { zh, en }

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
}

export function translate(lang: Lang, key: Key, vars?: Vars): string {
  return interpolate(DICT[lang][key] ?? DICT.zh[key] ?? key, vars)
}

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: Key, vars?: Vars) => string
}

const I18nContext = createContext<I18nValue>({
  lang: 'zh',
  setLang: () => {},
  t: (key, vars) => translate('zh', key, vars),
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang) ?? 'zh',
  )
  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en')
  }, [lang])
  const t = (key: Key, vars?: Vars) => translate(lang, key, vars)
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}

export { I18nContext }
export type { Key }
