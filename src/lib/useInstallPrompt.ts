import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'pwa-install-dismissed'

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua)
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const mq = window.matchMedia?.('(display-mode: standalone)')
  return mq?.matches === true || (navigator as Navigator & { standalone?: boolean }).standalone === true
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISSED_KEY) === '1' } catch { return false }
  })

  useEffect(() => {
    if (isStandalone() || dismissed) return
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [dismissed])

  const ios = isIosSafari() && !isStandalone()
  const canShow = !dismissed && !isStandalone() && (deferredPrompt !== null || ios)

  async function triggerPrompt() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  function dismiss() {
    try { localStorage.setItem(DISMISSED_KEY, '1') } catch { /* ignore */ }
    setDismissed(true)
    setDeferredPrompt(null)
  }

  return { canShow, ios: ios && deferredPrompt === null, triggerPrompt, dismiss }
}
