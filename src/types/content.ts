export type Status = 'GA' | 'Preview' | 'Validate'

export type ControlType = 'Prevent' | 'Detect' | 'Respond' | 'Govern' | 'Measure'

export type PlatformKind =
  | 'anthropic'
  | 'aws'
  | 'custom'
  | 'google'
  | 'microsoft'
  | 'openai'
  | 'saas'

export interface PlaybookStep {
  tool: string
  action: string
  status?: Status
  caveat?: string
  gaDate?: string
  /**
   * Optional allow-list of workloads this step applies to. If unset or empty,
   * the step applies to every workload the parent platform appears in.
   */
  appliesToWorkloads?: WorkloadCategory[]
}

export interface PlatformPlaybook {
  discover: PlaybookStep[]
  accessControl: PlaybookStep[]
  dataProtection: PlaybookStep[]
  monitorRespond: PlaybookStep[]
  govern: PlaybookStep[]
}

export interface Platform {
  id: string
  name: string
  kind: PlatformKind
  summary: string
  nativeControls: string[]
  microsoftCoverage: 'High' | 'Medium' | 'Low'
  playbook: PlatformPlaybook
  gaps: Gap[]
  sourceIds: string[]
  /**
   * Explicit allow-list of workloads this platform belongs in. Authoritative -
   * used by Step 2 to filter the platform picker and by Step 3 to scope the plan.
   */
  applicableWorkloads: WorkloadCategory[]
  /**
   * Optional per-layer contextual note. Rendered in the LayerCard's "Microsoft tools"
   * column when a layer has 0 tracked Microsoft tools. Use it to explain WHY there is
   * no tenant-configurable Microsoft control plane at this layer for this platform
   * (e.g., "OpenAI safety classifiers are vendor-internal").
   */
  layerContext?: Partial<Record<Layer, string>>
}

export interface SourceRef {
  id: string
  title: string
  url: string
  status: 'Official docs' | 'Official blog' | 'Framework' | 'Needs validation'
  note?: string
}

export interface ProductRole {
  role: string
  products: string
}

export interface ControlStep {
  label: string
  description: string
}

export interface Scenario {
  id: string
  label: string
  title: string
  customerQuestion: string
  whyItMatters: string
  risks: string[]
  controlPath: ControlStep[]
  productRoles: ProductRole[]
  recommendedAction: string
  relatedProducts: string[]
  relatedFrameworks: string[]
  sourceIds: string[]
  status: Status
}

export interface ProductFamily {
  id: string
  name: string
  plainLanguageRole: string
  whereAdminsWork: string
  controlTypes: ControlType[]
  scenarioIds: string[]
  sourceIds: string[]
  status: Status
  caveat?: string
}

export interface OperatingModelItem {
  id: string
  title: string
  leadershipQuestion: string
  description: string
  primaryProducts: string[]
}

export interface FrameworkMapping {
  control: string
  microsoft: string
}

export interface FrameworkItem {
  id: string
  name: string
  useWhen: string
  mapsTo: string[]
  title?: string
  summary?: string
  pillars?: string[]
  microsoftMappings?: FrameworkMapping[]
  sourceIds?: string[]
}

export type WorkloadCategory =
  | 'chat'
  | 'agents'
  | 'apps'
  | 'coding'
  | 'saas-embedded'
  | 'plugins'
  | 'infra'
  | 'apis'
  | 'data'
  | 'shadow'
  | 'ai-threats'
  | 'govern'

export interface UseCase {
  id: string
  workloadCategory: WorkloadCategory
  title: string
  /** Short label (≤5 words) used in workload "covers" chip strips. */
  shortTitle?: string
  shortDescription: string
  longDescription: string
  applicablePlatformKinds: PlatformKind[]
  sourceIds?: string[]
}

export interface Workload {
  id: WorkloadCategory
  title: string
  eyebrow?: string
  summary: string
  applicablePlatformKinds: PlatformKind[]
  /** Short labels of the child use cases (preserves the sub-card content as context). */
  coversConcerns: string[]
  sourceIds?: string[]
  useCaseIds: string[]
}

export type Layer =
  | 'identity'
  | 'network'
  | 'endpoint'
  | 'data'
  | 'app'
  | 'detect'
  | 'govern'

export interface ToolCoverage {
  microsoftTool: string
  whatItControls: string
  status?: Status
  caveat?: string
  layer?: Layer
  requiredSku?: string
  gaDate?: string
}

export type CompensatingControl = 'process' | 'third-party'

export interface Gap {
  gap: string
  compensatingControl: CompensatingControl
  suggestion: string
  layer?: Layer
  compensatingVendors?: string[]
  /**
   * Optional allow-list of workloads this gap applies to. If unset or empty,
   * the gap applies to every workload the parent platform appears in.
   */
  appliesToWorkloads?: WorkloadCategory[]
}

export interface Coverage {
  tools: ToolCoverage[]
  gaps: Gap[]
}

export interface LayerSection {
  layer: Layer
  tools: ToolCoverage[]
  gaps: Gap[]
  /**
   * Optional contextual note for this layer on this platform. Rendered when the
   * Microsoft tools column is empty to explain why (e.g., vendor-internal safety stack).
   */
  context?: string
}

export interface LayeredCoverage {
  layers: LayerSection[]
}
