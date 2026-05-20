import type { OperatingModelItem } from '../types/content'

interface OperatingModelProps {
  items: OperatingModelItem[]
}

export function OperatingModel({ items }: OperatingModelProps) {
  return (
    <section className="section" id="operating-model">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operating model</p>
          <h2>A repeatable way to explain Microsoft AI security.</h2>
          <p>Use this model after the scenario discussion to explain how the control planes connect.</p>
        </div>
      </div>

      <div className="model-list">
        {items.map((item, index) => (
          <article className="model-row card" key={item.id}>
            <span className="model-row__number">{index + 1}</span>
            <div>
              <p className="eyebrow">{item.leadershipQuestion}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className="pill-row">
              {item.primaryProducts.map((product) => (
                <span className="pill" key={product}>
                  {product}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
