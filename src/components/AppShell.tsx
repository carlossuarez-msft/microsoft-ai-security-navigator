import type { MouseEvent, ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  onStart?: () => void
  /** ISO date string for "last reviewed" footer. */
  lastReviewed?: string
}

export function AppShell({ children, onStart, lastReviewed }: AppShellProps) {
  const handleStart = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onStart?.()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="topbar">
        <div className="topbar__inner">
          <a
            className="brand"
            href="#start"
            onClick={handleStart}
            aria-label="Microsoft AI Security Navigator home"
          >
            <span className="brand__mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              <strong>Microsoft AI Security Navigator</strong>
              <small>Secure your GenAI workloads</small>
            </span>
          </a>
          <nav className="nav" aria-label="Page sections">
            <a href="#start" onClick={handleStart}>
              Start
            </a>
            <a href="#frameworks">Frameworks</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>
      <main className="page" id="main" tabIndex={-1}>{children}</main>
      <footer className="footer" aria-label="Site footer">
        <p>
          Independent reference. Microsoft control claims are validated against Microsoft Learn.
          Vendor (OpenAI, Anthropic, and others) capabilities are summarized from public
          documentation; verify against the vendor trust center before relying on them in
          production.
          {lastReviewed ? <> Last reviewed {lastReviewed}.</> : null}
        </p>
      </footer>
    </div>
  )
}
