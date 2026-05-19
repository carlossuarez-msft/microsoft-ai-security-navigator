import { useState } from 'react'
import type { Scenario } from '../types/content'
import { StatusPill } from './StatusPill'

interface ScenarioPlaybookProps {
  /** Initial scenario to display. Internal state takes over after first user click. */
  scenario: Scenario
  scenarios: Scenario[]
}

export function ScenarioPlaybook({ scenario, scenarios }: ScenarioPlaybookProps) {
  const [activeId, setActiveId] = useState<string>(scenario.id)
  const active = scenarios.find((s) => s.id === activeId) ?? scenario
  return (
    <section className="section" id="scenarios">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Scenario playbooks</p>
          <h2>Use the selected business moment as the entry point.</h2>
          <p>Each playbook covers the business question, risks, control path, product roles, and first action.</p>
        </div>
      </div>

      <div className="playbook-layout">
        <div className="scenario-list" aria-label="Scenario list">
          {scenarios.map((item) => (
            <button
              className={`scenario-list__item ${item.id === active.id ? 'is-active' : ''}`}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              type="button"
              aria-current={item.id === active.id ? 'true' : undefined}
            >
              <span>{item.label}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>

        <article className="playbook card">
          <div className="pill-row">
            <StatusPill status={active.status} />
            {active.relatedFrameworks.map((framework) => (
              <span className="pill" key={framework}>
                {framework}
              </span>
            ))}
          </div>
          <h3>{active.title}</h3>
          <p className="question">{active.customerQuestion}</p>

          <div className="playbook__grid">
            <section>
              <h4>What can go wrong</h4>
              <ul className="clean-list">
                {active.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>Microsoft control path</h4>
              <ol className="steps">
                {active.controlPath.map((step) => (
                  <li key={step.label}>
                    <strong>{step.label}</strong>
                    <span>{step.description}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section>
            <h4>Product roles</h4>
            <div className="role-grid">
              {active.productRoles.map((role) => (
                <div className="role-grid__row" key={role.role}>
                  <strong>{role.role}</strong>
                  <span>{role.products}</span>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </section>
  )
}
