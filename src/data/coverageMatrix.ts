import type {
  Coverage,
  Gap,
  Layer,
  LayerSection,
  LayeredCoverage,
  Platform,
  PlatformPlaybook,
  ToolCoverage,
  UseCase,
  Workload,
  WorkloadCategory,
} from '../types/content'
import { useCases } from './useCases'

// Defense-in-depth layer ordering used by Step 3. Keep in sync with `Layer`.
export const layerOrder: Layer[] = [
  'identity',
  'network',
  'endpoint',
  'data',
  'app',
  'detect',
  'govern',
]

export const layerLabel: Record<Layer, string> = {
  identity: 'Identity & Access',
  network: 'Network & Edge',
  endpoint: 'Endpoint & Device',
  data: 'Data Security',
  app: 'Application & Workload',
  detect: 'Threat Detection & Response',
  govern: 'Governance, Audit & Compliance',
}

export const layerSubtitle: Record<Layer, string> = {
  identity: 'Who can use it.',
  network: 'How traffic reaches the AI.',
  endpoint: 'What device it runs on.',
  data: 'What data goes in and out.',
  app: 'Controls inside the AI app or model itself.',
  detect: 'Find and act on attacks and abuse.',
  govern: 'Policy, lifecycle, audit, framework mapping.',
}

type LaneKey = keyof PlatformPlaybook

// Map an existing playbook step (tool name + action context) to a defense-in-depth layer.
// Hard-coded deterministic mapping - order matters, most specific first.
// `action` is provided as additional context for ambiguous tool names
// (e.g. "Global Secure Access" can be network OR identity depending on usage).
function classifyToolToLayer(tool: string, action: string, fallbackLane: LaneKey): Layer {
  const t = tool.toLowerCase()
  const a = (action ?? '').toLowerCase()
  const ctx = `${t} ${a}`

  // Tool-name anchored governance rules - run first so an "audit"-named tool wins over
  // downstream matches on IRM/DSPM/labels that appear in its action text.
  if (/purview audit|unified audit log|\bediscovery\b|e-discovery/.test(t)) return 'govern'
  if (/compliance manager|data lifecycle management|lifecycle management|retention policy|\bretention\b|service trust portal|privacy management/.test(t))
    return 'govern'

  // Early govern rule: multi-cloud connector / AI security posture / cloud security explorer
  // route to govern (cross-cloud posture is a governance surface, not application).
  if (/multi-cloud connector|multi[- ]cloud|ai security posture|defender csp.*aws|defender csp.*gcp|cloud security explorer/.test(ctx))
    return 'govern'

  // Early govern rule: Agent 365 / Entra Agent ID tools whose action is about
  // inventory / admin center / registration / catalog → govern (not identity).
  if (/agent 365|agent id|agent registry/.test(t) &&
      /inventory|admin center|registration|registry|catalog|govern|third[- ]party|publish|publication target/.test(`${t} ${a}`))
    return 'govern'

  // 1) Endpoint & device - Intune, Defender for Endpoint, Endpoint DLP, AppLocker/WDAC, Edge browser mgmt
  if (
    /\bintune\b|\bwdac\b|\bapplocker\b|defender for endpoint|endpoint dlp|device compliance|edge for business|microsoft edge management|software inventory|discovered apps/.test(
      ctx,
    )
  )
    return 'endpoint'

  // 2) Detect - Defender XDR, Sentinel, IRM, Communication Compliance, Defender for AI Services.
  // Pulled early so XDR/Sentinel/IRM/DfAIS beat broader matches downstream (DSPM, GSA, etc.)
  // Note: "security copilot" deliberately excluded so steps that protect the
  // Security Copilot platform itself can land in identity/network/endpoint/govern.
  // Existing uses of Security Copilot as a SOC tool (e.g. "Defender XDR + Sentinel + Security Copilot")
  // still classify as detect via the "defender xdr"/"sentinel" matches.
  if (
    /defender xdr|microsoft sentinel|\bsentinel\b|insider risk|\birm\b|communication compliance|defender for office|defender for ai services|defender security for ai/.test(
      ctx,
    )
  )
    return 'detect'

  // 2) Network & edge - GSA web/internet filtering, Shadow-AI discovery, web content, DfCA web/cloud discovery,
  //    network protection, SSE/SASE, network DLP, firewall, egress
  if (
    /web content filtering|internet access|network protection|shadow ai discovery|\bsse\b|\bsase\b|network data security|cloud app catalog|generative ai category|network egress|firewall|private endpoint|\begress\b/.test(
      ctx,
    )
  )
    return 'network'
  if (/global secure access|\bgsa\b/.test(t) && /web|shadow|internet|filter|discover|egress|network|category|claude|chat\.openai|traffic|forwarding|exchange|sharepoint|teams|microsoft.*profile/.test(a))
    return 'network'
  if (/defender for cloud apps/.test(t) && /discover|catalog|category|sanction|unsanction|shadow|web/.test(a))
    return 'network'

  // 3) Identity & access - Entra, Conditional Access, Agent 365, Entra Agent ID, Verified ID, SSO
  if (
    /\bentra\b|conditional access|\bsso\b|\bsaml\b|agent 365|agent id|verified id|access review|managed identit|workload id/.test(
      ctx,
    )
  )
    return 'identity'
  if (/global secure access|\bgsa\b/.test(t)) return 'identity' // identity-scoped GSA fallback

  // DfCA file/session policies and reverse-proxy → data (must come before residual DfCA→detect).
  if (/defender for cloud apps/.test(t) && /file polic|session polic|reverse[- ]proxy|conditional access app control|app control/.test(a))
    return 'data'

  // 6) Detect was hoisted above; only residual DfCA falls through here.
  if (/defender for cloud apps/.test(t)) return 'detect'

  // 4) Data security - Purview sensitivity labels / DLP / DSPM / Information Protection / classification /
  //    SharePoint Advanced Management, grounding/RAG data discovery
  if (
    /purview dlp|sensitivity label|purview information protection|purview data map|data classification|trainable classifier|\bsit\b|dspm|data security posture|sharepoint advanced|grounding|sensitive[- ]data discovery|sensitive data discovery|browser extension|activity explorer|endpoint dlp|network data security|file polic|session polic/.test(
      ctx,
    )
  )
    return 'data'

  // 5) App & workload - Content Safety, Prompt Shields, Azure OpenAI / Foundry,
  //    Key Vault for app secrets, APIM / model gateway. (Defender for AI Services moved to detect.)
  if (
    /content safety|prompt shield|azure openai|azure ai foundry|\bfoundry\b|defender for key vault|defender for storage|\bkey vault\b|azure api management|\bapim\b|model gateway|model inference|defender csp|defender for cloud(?! apps)/.test(
      ctx,
    )
  )
    return 'app'

  // 7) Governance, audit & compliance - eDiscovery, sanctioned catalogs, AUP, copilot admin reports, etc.
  if (
    /purview audit|unified audit|\baudit\b|ediscovery|e-discovery|compliance manager|lifecycle management|retention|service trust portal|privacy management|copilot reports|admin center|sanctioned|acceptable[- ]use|catalog|procurement|adoption|inventory/.test(
      ctx,
    )
  )
    return 'govern'

  // Final fallback - derive from lane
  switch (fallbackLane) {
    case 'accessControl':
      return 'identity'
    case 'dataProtection':
      return 'data'
    case 'monitorRespond':
      return 'detect'
    case 'discover':
      // discover lane is typically network-side reconnaissance for AI usage
      return /network|web|cloud|firewall|egress|shadow/.test(ctx) ? 'network' : 'govern'
    case 'govern':
    default:
      return 'govern'
  }
}

// For each use case, mark which playbook lanes are the *primary focus*.
// This is now a UI emphasis hint only - getCoverage ALWAYS iterates all five lanes.
// Defense in depth means the entire layered picture is always shown.
export const useCasePrimaryLanes: Record<string, LaneKey[]> = {
  // Chat
  'chat-prevent-data-leak': ['dataProtection'],
  'chat-control-access': ['accessControl'],
  'chat-audit-ediscovery': ['govern', 'monitorRespond'],
  'chat-block-consumer': ['discover', 'accessControl', 'govern'],

  // Agents
  'agents-govern-identity': ['govern', 'accessControl'],
  'agents-runtime-threats': ['monitorRespond', 'dataProtection'],
  'agents-data-grounding': ['dataProtection', 'accessControl'],

  // Apps
  'apps-secure-foundry': ['discover', 'accessControl', 'dataProtection', 'monitorRespond', 'govern'],
  'apps-content-safety': ['dataProtection', 'monitorRespond'],
  'apps-rag-pipeline': ['dataProtection', 'discover'],

  // Coding
  'coding-prevent-ip-leak': ['dataProtection', 'accessControl'],
  'coding-govern-tools': ['accessControl', 'govern'],

  // SaaS / embedded
  'saas-discover-embedded-ai': ['discover'],
  'saas-govern-embedded-ai': ['dataProtection', 'govern'],

  // Plugins / connectors / MCP
  'plugins-govern-connectors': ['govern', 'accessControl'],
  'plugins-secure-mcp': ['discover', 'accessControl'],

  // Infra
  'infra-azure-models': ['accessControl', 'dataProtection', 'monitorRespond'],
  'infra-non-azure-models': ['monitorRespond', 'accessControl'],

  // APIs
  'apis-secure-keys': ['accessControl'],
  'apis-agent-to-agent': ['accessControl', 'govern'],

  // Data
  'data-classify-grounding': ['dataProtection', 'discover'],
  'data-protect-finetune': ['dataProtection', 'accessControl'],

  // Shadow
  'shadow-discover-ai': ['discover'],

  // AI threats
  'ai-threats-phishing': ['monitorRespond'],
  'ai-threats-external-injection': ['dataProtection', 'monitorRespond'],

  // Govern
  'govern-framework-mapping': ['govern'],
  'govern-audit-lifecycle': ['monitorRespond', 'govern'],
}

// Use-case + platform specific gaps with explicit compensating control guidance.
// Keyed by `${useCaseId}:${platformId}`. Layer hint guides Step 3 placement.
const explicitGaps: Record<string, Gap[]> = {
  'chat-prevent-data-leak:m365-copilot': [
    {
      gap: 'Copilot still surfaces any item the user is technically permissioned to see - DLP cannot fix oversharing in the underlying SharePoint sites.',
      compensatingControl: 'process',
      suggestion:
        'Run SharePoint Advanced Management restricted-content discovery and remediate oversharing BEFORE broad Copilot rollout.',
      layer: 'data',
    },
  ],
  'chat-prevent-data-leak:chatgpt-enterprise': [
    {
      gap: 'Purview cannot enforce sensitivity labels, label-based encryption, or in-line DLP on ChatGPT Enterprise prompts - detection is after-the-fact only.',
      compensatingControl: 'third-party',
      suggestion:
        'Layer a pre-prompt redaction proxy or DLP gateway (Netskope, Zscaler, Palo Alto AI Access Security) in front of chat.openai.com, or rely on IRM + acceptable-use policy.',
      layer: 'data',
    },
  ],
  'chat-prevent-data-leak:chatgpt-consumer': [
    {
      gap: 'Mobile and BYOD coverage depends on Edge / Defender for Endpoint reach; unmanaged-device traffic to chat.openai.com is invisible.',
      compensatingControl: 'third-party',
      suggestion: 'Front BYOD egress through an SSE/SASE provider with AI-aware DLP.',
      layer: 'network',
    },
  ],
  'chat-prevent-data-leak:claude-web': [
    {
      gap: 'No Microsoft sensitivity-label enforcement at claude.ai; Purview audit captures interactions but cannot block at submission time.',
      compensatingControl: 'third-party',
      suggestion:
        'Use a CASB or AI-aware DLP gateway (Netskope, Zscaler, Palo Alto AI Access Security) for inline enforcement, or restrict Claude.ai to a sanctioned-user group at the GSA layer.',
      layer: 'data',
    },
  ],
  'chat-prevent-data-leak:claude-desktop': [
    {
      gap: 'Purview browser extension does not see the native Claude Desktop app - Edge / DSPM-for-AI flows do not apply.',
      compensatingControl: 'third-party',
      suggestion:
        'Combine Endpoint DLP + Intune app control + network egress controls; consider a CASB or endpoint AI-DLP product with native Claude Desktop integration.',
      layer: 'endpoint',
    },
  ],
  'chat-prevent-data-leak:claude-agents': [
    {
      gap: 'No prompt-content DLP via Microsoft for direct Anthropic API traffic from custom apps, CI jobs, or MCP servers.',
      compensatingControl: 'third-party',
      suggestion:
        'Front the model via Azure AI Model Inference (so Defender for AI Services applies), or deploy a 3rd-party prompt firewall such as Cisco AI Defense (formerly Robust Intelligence) or Lakera Guard.',
      layer: 'app',
    },
  ],

  'chat-audit-ediscovery:claude-web': [
    {
      gap: 'Microsoft Purview docs restrict eDiscovery, Communication Compliance, AND retention (the "Other AI apps" triad) to ChatGPT, Microsoft Chat (consumer version), Google Gemini, and DeepSeek - Claude is excluded from all three. Browser-extension Audit and IRM do flow for Claude on Edge.',
      compensatingControl: 'third-party',
      suggestion:
        'Export the Anthropic workspace audit log on a recurring schedule into Sentinel via a logic app or third-party AI DLP gateway; supplement with a third-party AI governance platform for prompt-level retention and eDiscovery.',
      layer: 'govern',
      compensatingVendors: ['Anthropic workspace audit export'],
    },
  ],
  'chat-audit-ediscovery:claude-desktop': [
    {
      gap: 'No prompt-level audit, classification, or retention via Microsoft for Claude Desktop - the browser extension cannot reach the native app.',
      compensatingControl: 'process',
      suggestion:
        'Document this gap in the AI governance program; if retention is mandatory, sanction only Claude.ai in Edge or move the workload to an enterprise Anthropic plan with vendor-side audit export to SIEM.',
      layer: 'govern',
    },
  ],
  'chat-audit-ediscovery:claude-agents': [
    {
      gap: 'No Microsoft-side prompt retention for direct Anthropic API calls.',
      compensatingControl: 'third-party',
      suggestion:
        'Ingest Anthropic workspace audit logs into Sentinel; require any sanctioned use to log prompts/responses to a tenant-controlled store.',
      layer: 'govern',
    },
  ],

  'ai-threats-external-injection:chatgpt-enterprise': [
    {
      gap: 'Microsoft does not inspect prompts in-line at chat.openai.com - Prompt Shields is for Azure-hosted apps only.',
      compensatingControl: 'third-party',
      suggestion:
        'Rely on OpenAI safety classifiers (per vendor docs) plus a prompt-firewall / AI gateway (CalypsoAI, Cisco AI Defense (formerly Robust Intelligence), Lakera Guard) in front of the workspace.',
      layer: 'app',
    },
  ],
  'ai-threats-external-injection:chatgpt-consumer': [
    {
      gap: 'No Microsoft in-line prompt-injection inspection for chat.openai.com from outside Azure.',
      compensatingControl: 'process',
      suggestion:
        'Treat the consumer tier as untrusted: block uploads of attacker-supplied documents, train users on indirect injection patterns.',
      layer: 'app',
    },
  ],
  'ai-threats-external-injection:claude-web': [
    {
      gap: 'No Microsoft in-line prompt-injection inspection at claude.ai.',
      compensatingControl: 'third-party',
      suggestion:
        'Rely on Anthropic constitutional-AI safety classifiers (per vendor docs); add a prompt-firewall such as Lakera Guard if you must inspect content.',
      layer: 'app',
    },
  ],
  'ai-threats-external-injection:claude-desktop': [
    {
      gap: 'No Microsoft in-line prompt-injection inspection for the native Claude Desktop app.',
      compensatingControl: 'third-party',
      suggestion:
        'Either prohibit Claude Desktop and steer users to a sanctioned channel, or rely on vendor-side safety classifiers (per vendor docs).',
      layer: 'app',
    },
  ],
  'ai-threats-external-injection:claude-agents': [
    {
      gap: 'Defender for AI Services / Prompt Shields only apply when the model is consumed via Azure AI Model Inference - direct api.anthropic.com calls are out of scope.',
      compensatingControl: 'third-party',
      suggestion:
        'Front the model via Azure AI Model Inference where possible; otherwise deploy a 3rd-party prompt firewall (Cisco AI Defense (formerly Robust Intelligence), Lakera Guard) in the app path.',
      layer: 'app',
    },
  ],

  'agents-runtime-threats:azure-foundry-custom': [
    {
      gap: 'Defender for AI Services does not cover image or audio tokens, Azure Government, 21Vianet, or AWS-connected accounts today.',
      compensatingControl: 'third-party',
      suggestion:
        'For multi-modal or sovereign workloads, supplement with vendor-native logging into Sentinel and a 3rd-party AI monitoring tool (Protect AI, Lakera, CalypsoAI).',
      layer: 'detect',
    },
    {
      gap: 'Threat protection for Foundry-built agents is public preview, not GA.',
      compensatingControl: 'process',
      suggestion: 'Track GA readiness; require manual review for production agents until GA.',
      layer: 'govern',
    },
  ],

  'agents-govern-identity:m365-copilot': [
    {
      gap: 'Some Agent 365 capabilities (Shadow AI for agents, agents-with-their-own-identity) remain in Frontier preview.',
      compensatingControl: 'process',
      suggestion:
        'Enroll in the Frontier program if needed; otherwise govern via the GA per-user Agent 365 controls and existing Entra workload identity governance.',
      layer: 'identity',
    },
  ],
  'agents-govern-identity:azure-foundry-custom': [
    {
      gap: 'Third-party agent governance via Agent 365 is limited to the pre-integrated partner list.',
      compensatingControl: 'process',
      suggestion:
        'Maintain a sanctioned-agent catalog with owner, purpose, identity, and shutdown path for any agent outside the Agent 365 integration set.',
      layer: 'govern',
    },
  ],

  'govern-audit-lifecycle:chatgpt-enterprise': [
    {
      gap: 'Non-Microsoft AI audit logs are pay-as-you-go billing with 180-day retention.',
      compensatingControl: 'process',
      suggestion:
        'Budget for pay-as-you-go audit; export to Sentinel for longer retention via the connector.',
      layer: 'govern',
    },
  ],
  'govern-audit-lifecycle:claude-web': [
    {
      gap: 'Prompt retention is not supported for Claude - investigations are point-in-time via the browser extension.',
      compensatingControl: 'third-party',
      suggestion:
        'Combine vendor-side audit export with SIEM ingestion; consider a 3rd-party AI governance platform.',
      layer: 'govern',
    },
  ],

  'data-classify-grounding:m365-copilot': [
    {
      gap: 'Label coverage depends on whether the underlying corpus has actually been classified.',
      compensatingControl: 'process',
      suggestion:
        'Run Purview auto-labeling and trainable classifiers on the SharePoint and OneDrive estate before scaling Copilot.',
      layer: 'data',
    },
  ],

  'chat-block-consumer:claude-desktop': [
    {
      gap: 'Web content filtering cannot block a native desktop app that is already installed; the block must happen at install time or via network egress.',
      compensatingControl: 'process',
      suggestion:
        'Use Intune app control / WDAC + AppLocker to block install, and Defender for Endpoint network protection to block api.anthropic.com egress from non-sanctioned devices.',
      layer: 'endpoint',
    },
  ],

  'apps-rag-pipeline:azure-foundry-custom': [
    {
      gap: 'Microsoft tooling can find sensitive grounding data but cannot guarantee the retrieval pipeline excludes it - that is an app-design decision.',
      compensatingControl: 'process',
      suggestion:
        'Treat the retrieval index as a privileged data store; require sensitivity-label-aware filtering in the app code.',
      layer: 'app',
    },
  ],

  // ---------- Coding assistants - Microsoft has no native control ----------
  'coding-prevent-ip-leak:claude-agents': [
    {
      gap: 'Microsoft has no native control over Claude Code, Cursor, Codeium, or Codex prompts - the IDE extension talks directly to the vendor.',
      compensatingControl: 'third-party',
      suggestion:
        'Combine GitHub Advanced Security secret scanning + Defender for Endpoint + Intune app control with a 3rd-party AI code-review tool (Lakera, GitGuardian) and repo-side push protection.',
      layer: 'endpoint',
    },
  ],
  'coding-prevent-ip-leak:chatgpt-enterprise': [
    {
      gap: 'Copilot for Business / ChatGPT-based coding assistants outside GitHub Copilot get no Microsoft prompt inspection.',
      compensatingControl: 'third-party',
      suggestion:
        'Enforce secret scanning at the repo (GitHub Advanced Security), block credential paste at the endpoint (Endpoint DLP), and add a 3rd-party AI code-review gate.',
      layer: 'data',
    },
  ],
  'coding-govern-tools:claude-agents': [
    {
      gap: 'No first-party Microsoft catalog of approved coding agents - each IDE extension must be allow-listed manually.',
      compensatingControl: 'process',
      suggestion:
        'Maintain an Intune app-control allow-list of approved IDE extensions and desktop coding agents; block all others. Use Defender for Endpoint network protection to block unsanctioned model endpoints.',
      layer: 'endpoint',
    },
  ],

  // ---------- SaaS / embedded AI - CASB is the answer ----------
  'saas-discover-embedded-ai:claude-agents': [
    {
      gap: 'Native SaaS admin controls are usually all you get for prompt content inside Notion AI, Slack AI, Einstein, Atlassian Intelligence, Now Assist, Zoom AI Companion.',
      compensatingControl: 'third-party',
      suggestion:
        'Use a CASB (Defender for Cloud Apps, Netskope, or Zscaler) for cross-SaaS AI visibility and session policies; pair with vendor-side admin scoping.',
      layer: 'detect',
    },
  ],
  'saas-govern-embedded-ai:claude-agents': [
    {
      gap: 'Purview cannot label-enforce inside a 3rd-party SaaS AI feature today - enforcement lives in the vendor admin console.',
      compensatingControl: 'third-party',
      suggestion:
        'Combine vendor-side scoping (turn off unsafe features, scope to least data) with CASB session policies for inline control.',
      layer: 'data',
    },
  ],

  // ---------- Plugins / MCP servers ----------
  'plugins-secure-mcp:azure-foundry-custom': [
    {
      gap: 'MCP server security is nascent. Purview "Copilot experiences and agents" + Entra app gallery only cover Microsoft-registered connectors.',
      compensatingControl: 'third-party',
      suggestion:
        'For raw MCP servers, use network segmentation, mutual auth, and a 3rd-party MCP gateway or prompt firewall in the call path.',
      layer: 'network',
    },
  ],
  'plugins-govern-connectors:chatgpt-enterprise': [
    {
      gap: 'ChatGPT custom GPTs / Actions sit outside the Microsoft connector governance surface.',
      compensatingControl: 'third-party',
      suggestion:
        'Govern via CASB session policies plus identity-side consent policies in Entra; manually review custom GPT permissions.',
      layer: 'govern',
    },
  ],

  // ---------- Non-Azure infrastructure ----------
  'infra-non-azure-models:claude-agents': [
    {
      gap: 'Defender for AI Services does not apply outside Azure - direct Anthropic / OpenAI / Bedrock endpoints are out of scope.',
      compensatingControl: 'third-party',
      suggestion:
        'Front the model via Azure AI Model Inference when possible, or deploy a 3rd-party prompt firewall (Cisco AI Defense (formerly Robust Intelligence), Lakera Guard, Protect AI) and ingest vendor audit into Sentinel.',
      layer: 'app',
    },
  ],
  'infra-non-azure-models:chatgpt-enterprise': [
    {
      gap: 'OpenAI consumer / enterprise endpoints sit outside Defender for AI Services scope.',
      compensatingControl: 'third-party',
      suggestion:
        'Use OpenAI Enterprise audit export into Sentinel + a 3rd-party prompt firewall for inline inspection.',
      layer: 'app',
    },
  ],

  // ---------- APIs ----------
  'apis-agent-to-agent:azure-foundry-custom': [
    {
      gap: 'Agent-to-agent and MCP-server-to-agent paths outside the Agent 365 surface have no first-party Microsoft inspection.',
      compensatingControl: 'third-party',
      suggestion:
        'Use OAuth client credentials + mTLS through an API gateway (APIM, Kong, or a dedicated MCP gateway) and log to Sentinel.',
      layer: 'network',
    },
  ],

  // ---------- Fine-tune data ----------
  'data-protect-finetune:azure-foundry-custom': [
    {
      gap: 'Microsoft has no first-party data-poisoning detector for fine-tune datasets - pipeline integrity is on you.',
      compensatingControl: 'process',
      suggestion:
        'Require code review and provenance signing on all training data; restrict dataset write access via Entra PIM and audit every change.',
      layer: 'data',
    },
  ],
}

function dedupeTools(tools: ToolCoverage[]): ToolCoverage[] {
  const seen = new Map<string, ToolCoverage>()
  for (const tool of tools) {
    // Same tool can legitimately appear under multiple layers (e.g. GSA in network
    // and identity); de-dupe per (tool, layer) pair, not by tool name alone.
    const key = `${tool.microsoftTool}|${tool.layer ?? ''}`
    if (!seen.has(key)) {
      seen.set(key, tool)
    }
  }
  return Array.from(seen.values())
}

const ALL_LANES: LaneKey[] = ['discover', 'accessControl', 'dataProtection', 'monitorRespond', 'govern']

export function getCoverage(useCase: UseCase, platform: Platform): Coverage {
  if (!useCase.applicablePlatformKinds.includes(platform.kind)) {
    return { tools: [], gaps: [] }
  }

  // Defense in depth - ALWAYS pull from every lane on the platform playbook.
  // The use-case-to-lane map is a UI emphasis hint, not a filter.
  const tools: ToolCoverage[] = []
  for (const lane of ALL_LANES) {
    const steps = platform.playbook[lane] ?? []
    for (const step of steps) {
      // Skip pure narrative "compensating control" entries from platforms.ts - those
      // belong in the gaps column, not the Microsoft-tools column.
      if (/^compensating control/i.test(step.tool)) continue
      tools.push({
        microsoftTool: step.tool,
        whatItControls: step.action,
        status: step.status,
        caveat: step.caveat,
        layer: classifyToolToLayer(step.tool, step.action, lane),
      })
    }
  }

  // platform.gaps is now Gap[] (typed). Carry layer hint through to Step 3 grouping.
  const baseGaps: Gap[] = platform.gaps.map((g) => ({ ...g }))

  const overrideGaps = explicitGaps[`${useCase.id}:${platform.id}`] ?? []

  // De-duplicate gaps by text. Overrides take precedence (more specific guidance).
  const gapMap = new Map<string, Gap>()
  for (const g of baseGaps) gapMap.set(g.gap, g)
  for (const g of overrideGaps) gapMap.set(g.gap, g)

  return {
    tools: dedupeTools(tools),
    gaps: Array.from(gapMap.values()),
  }
}

// Group flat coverage into the 7 defense-in-depth layers Step 3 renders.
// A layer with no tools and no gaps is still included so the UI can show
// "No Microsoft tool covers this layer for <platform> today" explicitly.
export function getLayeredCoverage(useCase: UseCase, platform: Platform): LayeredCoverage {
  const flat = getCoverage(useCase, platform)
  const byLayer = new Map<Layer, LayerSection>()
  for (const l of layerOrder) byLayer.set(l, { layer: l, tools: [], gaps: [] })

  for (const t of flat.tools) {
    const l = t.layer ?? 'app'
    byLayer.get(l)!.tools.push(t)
  }
  for (const g of flat.gaps) {
    const l = g.layer ?? guessGapLayer(g.gap)
    byLayer.get(l)!.gaps.push(g)
  }

  return { layers: layerOrder.map((l) => byLayer.get(l)!) }
}

// Map a use-case's primary lanes to the layers we should *emphasize* in Step 3.
const laneToPrimaryLayers: Record<LaneKey, Layer[]> = {
  discover: ['network', 'govern'],
  accessControl: ['identity'],
  dataProtection: ['data'],
  monitorRespond: ['detect'],
  govern: ['govern'],
}

export function getPrimaryLayers(useCase: UseCase): Layer[] {
  const lanes = useCasePrimaryLanes[useCase.id] ?? []
  const set = new Set<Layer>()
  for (const lane of lanes) for (const l of laneToPrimaryLayers[lane]) set.add(l)
  return Array.from(set)
}

// Workload-level coverage: same 7-layer plan, driven by platform.playbook only.
// Steps are filtered by `appliesToWorkloads` so each workload gets a plan
// scoped to that workload's defense-in-depth needs, not the union across the
// platform's entire surface area.
export function getLayeredCoverageForWorkload(workload: Workload, platform: Platform): LayeredCoverage {
  if (!platform.applicableWorkloads.includes(workload.id)) {
    return { layers: layerOrder.map((l) => ({ layer: l, tools: [], gaps: [] })) }
  }

  const stepAppliesToWorkload = (appliesTo?: WorkloadCategory[]) =>
    !appliesTo || appliesTo.length === 0 || appliesTo.includes(workload.id)

  const tools: ToolCoverage[] = []
  for (const lane of ALL_LANES) {
    const steps = platform.playbook[lane] ?? []
    for (const step of steps) {
      if (/^compensating control/i.test(step.tool)) continue
      if (!stepAppliesToWorkload(step.appliesToWorkloads)) continue
      tools.push({
        microsoftTool: step.tool,
        whatItControls: step.action,
        status: step.status,
        caveat: step.caveat,
        layer: classifyToolToLayer(step.tool, step.action, lane),
      })
    }
  }

  const gapMap = new Map<string, Gap>()
  for (const g of platform.gaps) {
    if (!stepAppliesToWorkload(g.appliesToWorkloads)) continue
    gapMap.set(g.gap, { ...g })
  }
  // Layer on any explicit per-(use-case, platform) gap overrides from child use cases -
  // they are more specific guidance than the generic platform gap.
  for (const ucId of workload.useCaseIds) {
    const override = explicitGaps[`${ucId}:${platform.id}`] ?? []
    for (const g of override) gapMap.set(g.gap, g)
  }

  const flatTools = dedupeTools(tools)
  const byLayer = new Map<Layer, LayerSection>()
  for (const l of layerOrder) byLayer.set(l, { layer: l, tools: [], gaps: [] })
  for (const t of flatTools) {
    const l = t.layer ?? 'app'
    byLayer.get(l)!.tools.push(t)
  }
  for (const g of gapMap.values()) {
    const l = g.layer ?? guessGapLayer(g.gap)
    byLayer.get(l)!.gaps.push(g)
  }
  return { layers: layerOrder.map((l) => byLayer.get(l)!) }
}

// Union of primary-layer emphasis across all child use cases of a workload.
export function getPrimaryLayersForWorkload(workload: Workload): Layer[] {
  const set = new Set<Layer>()
  for (const ucId of workload.useCaseIds) {
    const uc = useCases.find((u) => u.id === ucId)
    if (!uc) continue
    for (const l of getPrimaryLayers(uc)) set.add(l)
  }
  return Array.from(set)
}

function guessGapLayer(text: string): Layer {
  const t = text.toLowerCase()
  if (/\bdesktop\b|\bintune\b|\bendpoint\b|\bbyod\b/.test(t)) return 'endpoint'
  if (/\bnetwork\b|\begress\b|\bsse\b|\bsase\b|\bgateway\b|\bfirewall\b/.test(t)) return 'network'
  if (/\bidentity\b|\bentra\b|conditional access|agent id/.test(t)) return 'identity'
  if (/\bretention\b|\bediscovery\b|e-discovery|\baudit\b|\bcompliance\b|\bfrontier\b|\bgovern\b/.test(t)) return 'govern'
  if (/\bdlp\b|\blabel\b|labels\b|classification|grounding|sharepoint/.test(t)) return 'data'
  if (/\binsider\b|\bsentinel\b|defender for cloud apps|\bxdr\b|\bdetect\b/.test(t)) return 'detect'
  return 'app'
}
