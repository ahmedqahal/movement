// Resolve an app-relative asset path against the deploy base.
// Lets the same '/illustrations/x.webp' strings work at a domain root
// (Netlify/Vercel) and under a subpath (GitHub Pages project sites),
// without touching the 47 data entries that reference them.
export default function asset(path) {
  if (!path) return path
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}
