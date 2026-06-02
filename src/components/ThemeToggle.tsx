import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
const ORDER: Theme[] = ['system', 'light', 'dark']
const LABEL: Record<Theme, string> = { system: '跟随系统', light: '浅色', dark: '深色' }

export function ThemeToggle() {
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

  return (
    <button className="theme-toggle" aria-label="主题切换" onClick={cycle}>
      {LABEL[theme]}
    </button>
  )
}
