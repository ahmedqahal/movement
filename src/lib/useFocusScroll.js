import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

// When the URL carries a ?focus= param (set by global search deep-links),
// scroll to and briefly highlight the element with id `${prefix}${focus}`.
//
// Runs on short timeouts rather than a single rAF so it reliably lands AFTER
// the app's <ScrollToTop> (which resets scroll on every route change); a second
// corrective pass guarantees the final position even if the first is preempted.
export default function useFocusScroll(prefix) {
  const [params] = useSearchParams()
  const focus = params.get('focus')

  useEffect(() => {
    if (!focus) return
    let cancelled = false
    const timers = []

    const attempt = (smooth) => {
      if (cancelled) return
      const el = document.getElementById(prefix + focus)
      if (!el) return
      el.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' })
      if (!el.classList.contains('search-hit')) {
        el.classList.add('search-hit')
        timers.push(setTimeout(() => el.classList.remove('search-hit'), 2000))
      }
    }

    timers.push(setTimeout(() => attempt(true), 60))
    timers.push(setTimeout(() => attempt(false), 280))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [prefix, focus])
}
