import type { Scenario } from '../types/content'

export function findScenarioById(scenarios: Scenario[], id: string): Scenario {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0]
}
