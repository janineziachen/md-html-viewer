import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'

type Theme = 'system' | 'light' | 'dark'
const ORDER: Theme[] = ['system', 'light', 'dark']

export function ThemeToggle() {
  const { t } = useI18n()
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) ?? 'system',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function cycle() {
    setTheme((t) => ORDER[(ORDER.indexOf(t) + 1) % ORDER.length])
  }

  const label: Record<Theme, string> = {
    system: t('theme.system'),
    light: t('theme.light'),
    dark: t('theme.dark'),
  }

  return (
    <button className="theme-toggle" aria-label={t('theme.label')} onClick={cycle}>
      {label[theme]}
    </button>
  )
}
