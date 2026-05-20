import type { Status } from '../types/content'

interface StatusPillProps {
  status: Status
  /** Optional GA date (ISO yyyy-mm-dd). If in the future, surfaces "scheduled MMM D, YYYY" next to the GA pill. */
  gaDate?: string
}

// Status dot acts as a colour-blind-safe redundant indicator.
const dotChar: Record<Status, string> = {
  GA: '\u25CF',
  Preview: '\u25D0',
  Validate: '\u25CB',
}

// "Validate" is operator-jargon. Surface it to readers as "Gap" so they read it as a gap, not a to-do.
const labelText: Record<Status, string> = {
  GA: 'GA',
  Preview: 'Preview',
  Validate: 'Gap',
}

function formatGaDate(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function isFutureIso(iso: string, nowMs: number): boolean {
  const d = new Date(iso)
  return !Number.isNaN(d.getTime()) && d.getTime() > nowMs
}

export function StatusPill({ status, gaDate }: StatusPillProps) {
  // Date.now() is impure; compute once per render via a ref to a parent-stable value.
  // Acceptable for this readonly UI: stale by <1 frame is fine.
  const nowMs = typeof performance !== 'undefined' && performance.timeOrigin
    ? performance.timeOrigin
    : 0
  const showFutureGa = status === 'GA' && gaDate ? isFutureIso(gaDate, nowMs) : false
  const formatted = showFutureGa && gaDate ? formatGaDate(gaDate) : null
  return (
    <span className={`pill pill--compact pill--${status.toLowerCase()}`}>
      <span className="pill__dot" aria-hidden="true">{dotChar[status]}</span>
      {labelText[status]}
      {formatted ? <span className="pill__ga-date"> &middot; scheduled {formatted}</span> : null}
    </span>
  )
}

