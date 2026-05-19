import type { ProductFamily, Scenario } from '../types/content'
import { StatusPill } from './StatusPill'

interface ProductRoleMapProps {
  productFamilies: ProductFamily[]
  scenarios: Scenario[]
}

export function ProductRoleMap({ productFamilies, scenarios }: ProductRoleMapProps) {
  const getScenarioLabels = (scenarioIds: string[]) =>
    scenarioIds
      .map((scenarioId) => scenarios.find((scenario) => scenario.id === scenarioId)?.label)
      .filter(Boolean)
      .join(', ')

  return (
    <section className="section" id="product-roles">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Product role clarity</p>
          <h2>Do not ask which product secures AI. Ask which control plane leads.</h2>
          <p>Each product family has a role in the operating model. This keeps the story clear for leaders.</p>
        </div>
      </div>

      <div className="product-grid">
        {productFamilies.map((family) => (
          <article className="product-card card" key={family.id}>
            <div className="product-card__head">
              <h3>{family.name}</h3>
              <StatusPill status={family.status} />
            </div>
            <p>{family.plainLanguageRole}</p>
            <dl>
              <div>
                <dt>Where admins work</dt>
                <dd>{family.whereAdminsWork}</dd>
              </div>
              <div>
                <dt>Scenarios</dt>
                <dd>{getScenarioLabels(family.scenarioIds)}</dd>
              </div>
            </dl>
            {family.caveat ? <p className="caveat">{family.caveat}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
