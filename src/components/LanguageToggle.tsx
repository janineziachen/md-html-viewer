import { useI18n, type Lang } from '../lib/i18n'

const NEXT: Record<Lang, Lang> = { zh: 'en', en: 'zh' }

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <button
      className="lang-toggle"
      aria-label={t('lang.label')}
      onClick={() => setLang(NEXT[lang])}
    >
      <span className="lang-toggle-globe" aria-hidden>🌐</span>
      <span className={lang === 'zh' ? 'lang-seg lang-seg--active' : 'lang-seg'}>中</span>
      <span className="lang-toggle-sep" aria-hidden>/</span>
      <span className={lang === 'en' ? 'lang-seg lang-seg--active' : 'lang-seg'}>EN</span>
    </button>
  )
}
