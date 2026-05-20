import type { PlatformKind, Platform, UseCase, Workload, WorkloadCategory } from '../types/content'
import { platforms } from './platforms'
import { useCases } from './useCases'

// Canonical display order for the 12 AI workloads. Used by the wizard Step 1
// tile grid and any other place that renders workloads in a list.
export const workloadOrder: WorkloadCategory[] = [
  'chat',
  'agents',
  'apps',
  'coding',
  'saas-embedded',
  'plugins',
  'infra',
  'apis',
  'data',
  'shadow',
  'ai-threats',
  'govern',
]

// User-facing title for each workload. Mirrors the existing copy.
const workloadTitle: Record<WorkloadCategory, string> = {
  chat: 'Protect AI Assistants',
  agents: 'Protect AI Agents',
  apps: 'Protect AI Apps you build',
  coding: 'Protect AI Coding Assistants',
  'saas-embedded': 'Protect AI in SaaS / Embedded AI features',
  plugins: 'Protect AI Plugins, Connectors, and MCP servers',
  infra: 'Protect AI Infrastructure',
  apis: 'Protect AI APIs and Service-to-Service Access',
  data: 'Protect AI Training, Fine-tuning, and Grounding Data',
  shadow: 'Protect against Shadow / Unsanctioned AI',
  'ai-threats': 'Protect against AI-Generated Threats to your users',
  govern: 'Govern AI lifecycle and compliance',
}

// One-line summary per workload. The "Microsoft 365" branding is spelled out fully here.
const workloadSummary: Record<WorkloadCategory, string> = {
  chat:
    'End-user AI assistants - Microsoft 365 Copilot, ChatGPT, Claude, Gemini, Copilot Chat. Conversational + agentic surfaces (Pages, Researcher, Workspace Agents, Cowork).',
  agents:
    'Autonomous and semi-autonomous agents - Copilot agents, Copilot Studio, Foundry agents, Agent 365, 3rd-party agents.',
  apps:
    'Custom GenAI applications your org ships - Foundry apps, Azure OpenAI apps, RAG apps, embedded Copilot in your product.',
  coding:
    'Developer-facing AI - GitHub Copilot, Claude Code, Cursor, Codeium, Codex, Copilot for Azure.',
  'saas-embedded':
    'AI quietly turned on inside 3rd-party SaaS - Notion AI, Slack AI, Einstein, Atlassian Intelligence, Now Assist, Zoom AI Companion.',
  plugins:
    'Copilot connectors, Copilot Studio actions, MCP servers, ChatGPT custom GPTs / Actions, Claude integrations.',
  infra:
    'The hosting / model / API layer - Azure OpenAI, Foundry, model gateways, foundation model endpoints, model registry, training stores.',
  apis:
    'Programmatic access - Anthropic API, OpenAI API, Azure OpenAI keys, agent-to-agent auth, MCP server auth.',
  data:
    'The data going INTO models and RAG indexes - SharePoint grounding, custom embeddings, fine-tune datasets.',
  shadow:
    'Discover and govern AI the org never approved - browser-based, desktop apps, personal accounts.',
  'ai-threats':
    'Defense against attackers using AI - AI-generated phishing, deepfakes, synthetic identity, prompt injection from external content.',
  govern:
    'Audit, eDiscovery, IRM, Compliance Manager - frameworks like NIST AI RMF, ISO/IEC 42001, EU AI Act.',
}

// Used on Step 2 to make the platform-picker heading specific to the workload.
export const workloadStep2Heading: Record<WorkloadCategory, string> = {
  chat: 'Which AI assistant are your users on?',
  agents: 'Which agent platform?',
  apps: 'Which AI app stack are you building on?',
  coding: 'Which AI coding assistant are your developers using?',
  'saas-embedded': 'Which AI-enabled SaaS are you trying to govern?',
  plugins: 'Which plugin, connector, or MCP surface?',
  infra: 'Which AI infrastructure are you trying to secure?',
  apis: 'Which AI API or service path?',
  data: 'Where does the data feeding the model live?',
  shadow: 'Which unsanctioned AI surface should we look for?',
  'ai-threats': 'Where is the AI-generated threat landing?',
  govern: 'Which AI surface are you governing?',
}

function buildWorkloads(): Workload[] {
  const byCat = new Map<WorkloadCategory, UseCase[]>()
  for (const wl of workloadOrder) byCat.set(wl, [])
  for (const uc of useCases) byCat.get(uc.workloadCategory)?.push(uc)

  const out: Workload[] = []
  for (const wl of workloadOrder) {
    const children = byCat.get(wl) ?? []
    if (children.length === 0) continue

    // Skip workloads that, after the platform.applicableWorkloads matrix is
    // applied, have zero platforms. Prevents Step 1 from offering a dead-end tile.
    const platformsForCat = platforms.filter((p) => p.applicableWorkloads.includes(wl))
    if (platformsForCat.length === 0) continue

    const kinds = new Set<PlatformKind>()
    const sources = new Set<string>()
    const concerns: string[] = []
    const useCaseIds: string[] = []
    for (const uc of children) {
      uc.applicablePlatformKinds.forEach((k) => kinds.add(k))
      uc.sourceIds?.forEach((s) => sources.add(s))
      concerns.push(uc.shortTitle ?? uc.title)
      useCaseIds.push(uc.id)
    }

    out.push({
      id: wl,
      title: workloadTitle[wl],
      summary: workloadSummary[wl],
      applicablePlatformKinds: Array.from(kinds),
      coversConcerns: concerns,
      sourceIds: sources.size > 0 ? Array.from(sources) : undefined,
      useCaseIds,
    })
  }
  return out
}

export const workloads: Workload[] = buildWorkloads()

export const workloadById: Record<string, Workload> = workloads.reduce(
  (acc, w) => {
    acc[w.id] = w
    return acc
  },
  {} as Record<string, Workload>,
)

/**
 * Authoritative Step-2 platform lookup. Returns only platforms whose
 * `applicableWorkloads` array includes the given workload id. Use this instead
 * of the legacy `applicablePlatformKinds` kind union, which over-matches
 * (e.g. would surface end-user chat assistants under "Protect AI Agents").
 */
export function platformsForWorkload(workloadId: WorkloadCategory): Platform[] {
  return platforms.filter((p) => p.applicableWorkloads.includes(workloadId))
}
