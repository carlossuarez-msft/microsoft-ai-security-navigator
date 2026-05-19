import type { ProductFamily } from '../types/content'

export const productFamilies: ProductFamily[] = [
  {
    id: 'entra',
    name: 'Microsoft Entra',
    plainLanguageRole: 'Controls who can access AI experiences, agents, apps, and workload identities.',
    whereAdminsWork: 'Microsoft Entra admin center',
    controlTypes: ['Prevent', 'Govern'],
    scenarioIds: ['m365-copilot', 'public-ai-tools', 'agent-governance', 'azure-ai-apps'],
    sourceIds: ['gsa-overview'],
    status: 'GA',
  },
  {
    id: 'gsa',
    name: 'Entra Internet Access / Global Secure Access',
    plainLanguageRole:
      'Governs access to public AI tools at the network and web layer using identity-aware web filtering, and provides Shadow AI discovery that explicitly identifies ChatGPT, Claude, SaaS MCP servers, and AI model provider APIs (e.g., Anthropic Claude API, DeepSeek).',
    whereAdminsWork: 'Microsoft Entra admin center > Global Secure Access',
    controlTypes: ['Prevent', 'Detect', 'Govern'],
    scenarioIds: ['public-ai-tools'],
    sourceIds: ['gsa-overview', 'gsa-ai-category', 'gsa-shadow-ai'],
    status: 'GA',
    caveat: 'Validate exact AI site category coverage and URL filtering limits in your tenant.',
  },
  {
    id: 'purview',
    name: 'Microsoft Purview',
    plainLanguageRole:
      'Protects sensitive data used by AI through DSPM, classification, DLP, audit, eDiscovery, IRM, and retention. Coverage differs by AI surface: Copilot (full — labels, encryption, DLP, retention), Enterprise AI apps such as ChatGPT Enterprise (audit, classification, IRM, eDiscovery — no labels/encryption/DLP), and Other AI apps such as Claude/Gemini (DLP and classification via browser extension / Edge / network; no labels; retention only for ChatGPT, Microsoft Chat (consumer version), Gemini, DeepSeek — Claude not on the supported retention list).',
    whereAdminsWork: 'Microsoft Purview portal',
    controlTypes: ['Prevent', 'Detect', 'Govern', 'Measure'],
    scenarioIds: ['m365-copilot', 'public-ai-tools'],
    sourceIds: ['purview-ai', 'purview-chatgpt-enterprise', 'purview-other-ai-apps', 'audit-copilot'],
    status: 'GA',
    caveat:
      'Audit logs for non-Microsoft AI apps use pay-as-you-go billing with 180-day retention; sensitivity labels and encryption are not enforced at third-party AI surfaces; prompt retention for "Other AI apps" requires the Microsoft Edge browser and is limited to a named app list.',
  },
  {
    id: 'security-for-ai',
    name: 'Microsoft Agent 365 and Security for AI',
    plainLanguageRole:
      'Microsoft Agent 365 is the per-user control plane for Microsoft and pre-integrated third-party agents (GA May 1, 2026), surfaced through the Microsoft 365 admin center Agent workload and integrated with Entra, Purview, and Defender. Security for AI surfaces agent inventory, posture, and detections in the Microsoft Defender portal.',
    whereAdminsWork: 'Microsoft 365 admin center (Agents), Microsoft Defender portal',
    controlTypes: ['Detect', 'Respond', 'Govern'],
    scenarioIds: ['agent-governance'],
    sourceIds: ['agent-365-overview', 'agent-365-frontier', 'security-for-ai'],
    status: 'GA',
    caveat:
      'Agent 365 recommends Entra P1/P2 (or Entra Suite) plus Purview DLP. Specific capabilities (Shadow AI for agents, agents with their own identity) remain in the Frontier preview program; third-party agent coverage is limited to the pre-integrated partner list at launch.',
  },
  {
    id: 'defender-cloud-ai',
    name: 'Microsoft Defender for AI Services',
    plainLanguageRole:
      'Runtime threat protection for Azure-hosted AI services. Generates alerts for jailbreak attempts, wallet abuse, data exposure, credential theft, and suspicious access patterns using signals from Azure AI Content Safety Prompt Shields and Microsoft Threat Intelligence. Formerly named "threat protection for AI workloads"; renamed and made GA on May 1, 2025.',
    whereAdminsWork: 'Azure portal and Microsoft Defender portal',
    controlTypes: ['Detect', 'Respond', 'Measure'],
    scenarioIds: ['azure-ai-apps'],
    sourceIds: ['defender-ai-services'],
    status: 'GA',
    caveat:
      'Supports Azure OpenAI and Azure AI Model Inference text tokens only (no image/audio). Commercial clouds only — not available in Azure Government, Azure operated by 21Vianet, or connected AWS accounts. Threat protection for AI agents built with Foundry is in public preview (Feb 2026).',
  },
]
