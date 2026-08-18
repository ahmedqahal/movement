import { Component } from 'react'

// Keeps one broken component from white-screening the whole app. Your saved
// progress and practice log live in localStorage/IndexedDB and are untouched
// by a render error, so reloading is genuinely safe advice.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Left in deliberately: with no analytics, the console is the only place
    // a real fault would otherwise surface.
    console.error('Movement crashed while rendering:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="content">
        <div className="card empty-state" style={{ padding: '60px 24px' }}>
          <h3>Something went wrong on this page</h3>
          <p style={{ maxWidth: '52ch', margin: '0 auto 18px' }}>
            A page failed to render. Your progress, notes and practice log are stored on this
            device and are not affected — reloading should put things right.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--solid" onClick={() => window.location.reload()}>
              Reload the app
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                window.location.hash = '#/'
                window.location.reload()
              }}
            >
              Go to Home
            </button>
          </div>
          <details style={{ marginTop: 24, textAlign: 'left', maxWidth: '60ch', margin: '24px auto 0' }}>
            <summary style={{ cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Technical details
            </summary>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '0.78rem',
                color: 'var(--text-faint)',
                marginTop: 10,
              }}
            >
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          </details>
        </div>
      </main>
    )
  }
}
