import type { Scenario } from '../types/content'

export const scenarios: Scenario[] = [
  {
    id: 'm365-copilot',
    label: 'Copilot rollout',
    title: 'We are rolling out Microsoft 365 Copilot',
    customerQuestion:
      'If we give Copilot to thousands of users, will it expose information they technically can access but should not see?',
    whyItMatters:
      'Microsoft 365 Copilot can amplify existing Microsoft Graph permissions, overshared SharePoint content, and unlabeled sensitive data. Purview support for Copilot is the strongest in the Microsoft AI portfolio — sensitivity labels, encryption, and in-line DLP are all enforced — unlike for third-party AI surfaces such as ChatGPT Enterprise or Claude where label/DLP coverage is limited.',
    risks: [
      'Overshared SharePoint sites become easier to discover.',
      'Sensitive files lack labels, DLP policy, or lifecycle controls.',
      'Users access Copilot from unmanaged or risky devices.',
      'AI interactions are not monitored, audited, or reviewed.',
    ],
    controlPath: [
      { label: 'Assess data risk', description: 'Use Purview DSPM for AI and SharePoint data access governance.' },
      { label: 'Protect data', description: 'Use sensitivity labels, DLP, retention, and audit controls.' },
      { label: 'Control access', description: 'Use Entra Conditional Access and Intune device compliance.' },
      { label: 'Monitor activity', description: 'Use Purview Audit, Insider Risk, Defender XDR, and Sentinel where appropriate.' },
    ],
    productRoles: [
      { role: 'Identity and access', products: 'Microsoft Entra, Conditional Access' },
      { role: 'Data security', products: 'Microsoft Purview DSPM for AI, labels, DLP, Audit' },
      { role: 'Device control', products: 'Microsoft Intune, Defender for Endpoint' },
      { role: 'Detection and response', products: 'Defender XDR, Microsoft Sentinel, Security Copilot' },
    ],
    recommendedAction: 'Run a Copilot data security readiness assessment before broad rollout.',
    relatedProducts: ['Microsoft 365 Copilot', 'Microsoft Purview', 'Microsoft Entra', 'Microsoft Intune', 'Defender XDR'],
    relatedFrameworks: ['nist-ai-rmf', 'cis-controls', 'iso-iec-42001'],
    sourceIds: ['purview-ai'],
    status: 'GA',
  },
  {
    id: 'public-ai-tools',
    label: 'Public AI tools',
    title: 'Employees are using public AI tools',
    customerQuestion:
      'How do we control access to public generative AI tools without blocking every innovation use case?',
    whyItMatters:
      'Public AI tool governance needs network-layer enforcement, identity-aware policy, app discovery, and data loss controls.',
    risks: [
      'Sensitive data is pasted into third-party AI tools.',
      'Teams bypass approved AI platforms through personal accounts.',
      'Security teams lack visibility into AI website usage.',
      'Blanket blocking creates business friction and shadow workarounds.',
    ],
    controlPath: [
      { label: 'Discover usage', description: 'Use Entra Global Secure Access Shadow AI discovery (which explicitly identifies ChatGPT, Claude, SaaS MCP servers, and AI model provider APIs such as the Anthropic Claude API). Pair with Defender for Cloud Apps cloud app catalog filtered by App category > Generative AI.' },
      { label: 'Control web access', description: 'Use Entra Internet Access / Global Secure Access web content filtering with the Artificial Intelligence category, scoped via Conditional Access.' },
      { label: 'Scope by identity', description: 'Link Global Secure Access security profiles to Conditional Access for users and groups.' },
      { label: 'Prevent exfiltration', description: 'Use Purview DLP for "Other AI apps" (browser/network/Edge layer) and Endpoint DLP. Note: enforced sensitivity labels and prompt retention are not supported for most third-party AI sites; Claude is not on the supported retention list today.' },
    ],
    productRoles: [
      { role: 'Network and web access', products: 'Microsoft Entra Internet Access / Global Secure Access' },
      { role: 'Shadow AI discovery', products: 'Global Secure Access Shadow AI discovery, Microsoft Defender for Cloud Apps' },
      { role: 'Data protection', products: 'Microsoft Purview DLP for "Other AI apps", Endpoint DLP, Purview browser extension / Edge integration' },
      { role: 'Identity-aware policy', products: 'Conditional Access' },
    ],
    recommendedAction:
      'Stand up GSA Shadow AI discovery and Defender for Cloud Apps Generative AI catalog filtering first. Then layer GSA web content filtering plus Purview DLP for "Other AI apps" for enforcement. Universal Tenant Restrictions only stops Entra-integrated AI tenants and does not block public sites like Claude.ai or ChatGPT consumer.',
    relatedProducts: ['Entra Internet Access', 'Global Secure Access', 'Defender for Cloud Apps', 'Purview DLP', 'Purview browser extension'],
    relatedFrameworks: ['nist-ai-rmf', 'csa', 'cis-controls'],
    sourceIds: ['gsa-overview', 'gsa-ai-category', 'gsa-shadow-ai', 'dfca-shadow-ai', 'purview-other-ai-apps'],
    status: 'GA',
  },
  {
    id: 'agent-governance',
    label: 'Agent governance',
    title: 'We need to govern AI agents and identities',
    customerQuestion: 'Who owns each agent, what can it access, and how do we disable it when it becomes risky?',
    whyItMatters:
      'Agentic AI expands the identity and authorization surface with autonomous actions, tool use, and long-lived permissions. Microsoft Agent 365 became generally available on May 1, 2026 as the per-user control plane for Microsoft-built and pre-integrated third-party agents; certain capabilities (Shadow AI for agents, agents with their own identity) remain in the Frontier preview program.',
    risks: [
      'Agents lack accountable human owners.',
      'Agent identities accumulate permissions.',
      'Unsafe agent actions are not blocked before execution.',
      'SOC teams cannot quickly investigate or disable risky agents.',
    ],
    controlPath: [
      { label: 'Inventory agents', description: 'Use Microsoft Agent 365 (GA) for inventory of Microsoft and pre-integrated third-party agents; review the Agent workload in the Microsoft 365 admin center.' },
      { label: 'Assign owners', description: 'Require business sponsorship, purpose, data scope, and shutdown path.' },
      { label: 'Control access', description: 'Use Microsoft Entra Agent ID for agent identity, workload identity governance, Conditional Access, and access reviews. Microsoft recommends Entra P1/P2 or Entra Suite alongside Purview DLP to make full use of Agent 365.' },
      { label: 'Detect and respond', description: 'Use Defender for Cloud Apps real-time agent protection during runtime, Defender XDR, Microsoft Sentinel, and Security Copilot.' },
    ],
    productRoles: [
      { role: 'Agent lifecycle and control plane', products: 'Microsoft Agent 365' },
      { role: 'Agent identity', products: 'Microsoft Entra Agent ID' },
      { role: 'Agent runtime protection', products: 'Microsoft Defender for Cloud Apps real-time agent protection' },
      { role: 'SOC response', products: 'Defender XDR, Microsoft Sentinel, Security Copilot' },
    ],
    recommendedAction:
      'Enable Agent 365 for at least one licensed user, then define a minimum agent registration standard (owner, purpose, identity, permissions, data scope, shutdown path) and apply it to both Microsoft-built and pre-integrated third-party agents.',
    relatedProducts: ['Microsoft Agent 365', 'Entra Agent ID', 'Defender for Cloud Apps', 'Defender XDR', 'Sentinel'],
    relatedFrameworks: ['owasp-llm-top-10', 'mitre-atlas', 'cisa-ai-guidance'],
    sourceIds: ['agent-365-overview', 'agent-365-frontier', 'security-for-ai'],
    status: 'GA',
  },
  {
    id: 'azure-ai-apps',
    label: 'Custom AI apps',
    title: 'Developers are building Azure AI Foundry apps',
    customerQuestion: 'How do we secure model access, RAG, prompt injection risk, secrets, and workload identities?',
    whyItMatters:
      'Internal AI workloads need cloud security posture, identity-first access, content safety, and runtime threat detection.',
    risks: [
      'API keys and secrets are overused.',
      'Prompt injection or malicious content influences tool calls.',
      'RAG apps retrieve sensitive or poisoned content.',
      'AI workload alerts do not reach the SOC.',
    ],
    controlPath: [
      { label: 'Use identity-first access', description: 'Use Entra ID, managed identities, RBAC, and least-privilege roles.' },
      { label: 'Protect secrets', description: 'Use Key Vault and remove broad embedded keys wherever possible.' },
      { label: 'Add AI safety controls', description: 'Use Azure AI Content Safety Prompt Shields (the producer of jailbreak/prompt-injection signals), Foundry guardrails, content filters, and evaluations. Defender for AI Services consumes Prompt Shields signals to generate alerts.' },
      { label: 'Enable threat protection', description: 'Use Microsoft Defender for AI Services (GA May 1, 2025; formerly "threat protection for AI workloads") for Azure OpenAI and Azure AI Model Inference runtime alerts (text tokens only; commercial cloud only — no Azure Government, 21Vianet, or connected AWS accounts). Threat protection for Foundry-built AI agents is in public preview. Route alerts to Defender XDR / Sentinel.' },
    ],
    productRoles: [
      { role: 'AI app platform', products: 'Azure AI Foundry' },
      { role: 'Identity', products: 'Microsoft Entra ID, managed identities, RBAC' },
      { role: 'Safety', products: 'Azure AI Content Safety (Prompt Shields), Foundry guardrails' },
      { role: 'Cloud security', products: 'Microsoft Defender for AI Services, Defender for Cloud, Key Vault' },
    ],
    recommendedAction: 'Replace broad keys with managed identity and enable AI workload threat protection.',
    relatedProducts: ['Azure AI Foundry', 'Azure AI Content Safety (Prompt Shields)', 'Microsoft Defender for AI Services', 'Key Vault'],
    relatedFrameworks: ['owasp-llm-top-10', 'mitre-atlas', 'nist-ai-rmf'],
    sourceIds: ['defender-ai-services'],
    status: 'GA',
  },
]
