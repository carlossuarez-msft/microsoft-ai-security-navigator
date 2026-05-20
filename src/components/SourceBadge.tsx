import { sources } from '../data/sources'

interface SourceBadgeProps {
  sourceId: string
}

export function SourceBadge({ sourceId }: SourceBadgeProps) {
  const source = sources.find((item) => item.id === sourceId)

  if (!source) {
    return null
  }

  return (
    <a className="pill pill--link" href={source.url} rel="noopener noreferrer" target="_blank">
      {source.title}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  )
}
