import type { FrameworkItem } from '../types/content'

interface FrameworkAlignmentProps {
  frameworks: FrameworkItem[]
}

export function FrameworkAlignment({ frameworks }: FrameworkAlignmentProps) {
  return (
    <section className="section" id="frameworks">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Framework alignment</p>
          <h2>Frameworks validate the approach, but should not be your starting point.</h2>
          <p>Use these as evidence after you understand the practical Microsoft control path.</p>
        </div>
      </div>

      <div className="framework-grid">
        {frameworks.map((framework) => (
          <article className="framework-card card" key={framework.id}>
            <h3>{framework.name}</h3>
            <p>{framework.useWhen}</p>
            <div className="pill-row">
              {framework.mapsTo.map((mapping) => (
                <span className="pill" key={mapping}>
                  {mapping}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
