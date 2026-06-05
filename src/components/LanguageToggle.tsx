import { useI18n, type Lang } from '../lib/i18n'

const NEXT: Record<Lang, Lang> = { zh: 'en', en: 'zh' }
const LABEL: Record<Lang, string> = { zh: '中', en: 'EN' }

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <button
      className="lang-toggle"
      aria-label={t('lang.label')}
      onClick={() => setLang(NEXT[lang])}
    >
      {LABEL[lang]}
    </button>
  )
}
