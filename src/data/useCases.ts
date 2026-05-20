import type { UseCase } from '../types/content'

// Use cases are framed by the AI WORKLOAD the reader is trying to protect,
// not by security domain. Each tile is one concrete question; tiles
// are grouped under workload headings on Step 1.
//
// Vendor / Microsoft control claims live in platforms.ts and coverageMatrix.ts.
// Keep titles in plain language; long descriptions stay vendor-honest.

export const useCases: UseCase[] = [
  // ---------- Protect AI Chat ----------
  {
    id: 'chat-prevent-data-leak',
    workloadCategory: 'chat',
    title: 'Prevent sensitive data from leaking into AI chat assistants',
    shortTitle: 'Prevent oversharing',
    shortDescription:
      'Block confidential content from being pasted, uploaded, or grounded into Microsoft 365 Copilot, ChatGPT, Claude.ai, Gemini, or Bing/Edge Copilot.',
    longDescription:
      'Microsoft 365 Copilot honors sensitivity labels and in-line DLP natively. ChatGPT Enterprise gets classification and IRM (Insider Risk Management) but no label enforcement. Claude.ai, Claude Desktop, Gemini, and consumer chat assistants are reachable only through browser, endpoint, or network DLP. Claude Desktop is invisible to the browser extension entirely.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom'],
  },
  {
    id: 'chat-control-access',
    workloadCategory: 'chat',
    title: 'Control which users and devices can reach which chat assistant',
    shortTitle: 'Access control',
    shortDescription:
      'Scope chat-assistant access by identity, group, device compliance, and network path.',
    longDescription:
      'Entra Conditional Access, Intune device compliance, and Global Secure Access web content filtering (Artificial Intelligence category) together decide who can reach Copilot, ChatGPT, Claude.ai, Gemini, or Bing Chat - and from what kind of device.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom'],
  },
  {
    id: 'chat-audit-ediscovery',
    workloadCategory: 'chat',
    title: 'Audit and retain chat-assistant conversations for eDiscovery',
    shortTitle: 'Audit / eDiscovery',
    shortDescription:
      'Capture, hold, search, and dispose of chat conversations for regulators, HR, or legal.',
    longDescription:
      'Purview eDiscovery and Data Lifecycle Management cover Microsoft 365 Copilot and ChatGPT Enterprise natively. Retention for "Other AI apps" is limited to ChatGPT consumer, Microsoft Chat (consumer version), Gemini, and DeepSeek today. Claude is not on the supported retention list. Claude Desktop is invisible to the browser extension.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom'],
  },
  {
    id: 'chat-block-consumer',
    workloadCategory: 'chat',
    title: 'Block unsanctioned consumer chat assistants (ChatGPT, Claude, Gemini)',
    shortTitle: 'Block consumer chat',
    shortDescription:
      'Decide which consumer chat tools are allowed and enforce that decision at access time.',
    longDescription:
      'Defender for Cloud Apps marks Generative AI apps sanctioned or unsanctioned. GSA web content filtering enforces the decision at the network layer scoped by Conditional Access. Intune handles installed desktop apps where the browser cannot.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },

  // ---------- Protect AI Agents ----------
  {
    id: 'agents-govern-identity',
    workloadCategory: 'agents',
    title: 'Govern AI agent identities, owners, and lifecycle',
    shortTitle: 'Agent identity & lifecycle',
    shortDescription:
      'Give every agent (Microsoft 365, Copilot Studio, Foundry, third-party) an owner, purpose, identity, and shutdown path.',
    longDescription:
      'Agent 365 is the per-user control plane for Microsoft and pre-integrated third-party agents (GA since May 1, 2026). Microsoft recommends Entra P1/P2 (or Entra Suite) plus Purview DLP for full Agent 365 coverage. Entra Agent ID gives agents their own identity. Some agent-specific capabilities remain in Frontier preview.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'aws', 'google', 'custom', 'saas'],
  },
  {
    id: 'agents-runtime-threats',
    workloadCategory: 'agents',
    title: 'Detect runtime threats and abuse in AI agents',
    shortTitle: 'Runtime threats',
    shortDescription:
      'Find jailbreaks, wallet abuse, credential theft, and abnormal tool calls on Foundry and Copilot Studio agents.',
    longDescription:
      'Defender for AI Services raises runtime alerts on Azure-hosted agents (Foundry agent threat protection is in public preview). Copilot Studio agents inherit Purview audit and IRM signals. Third-party agents the org adopts are covered only to the extent they appear in Agent 365 partner integrations or Defender XDR AI agent inventory (which today covers Microsoft Copilot Studio, Microsoft Foundry, AWS Bedrock, and GCP Vertex AI).',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'aws', 'google', 'custom', 'saas'],
  },
  {
    id: 'agents-data-grounding',
    workloadCategory: 'agents',
    title: 'Constrain what data agents can read, write, and act on',
    shortTitle: 'Constrain agent data',
    shortDescription:
      'Limit agent grounding scope and tool permissions so agents do not exfiltrate or overshare.',
    longDescription:
      'Purview DLP for agents, SharePoint Advanced Management restricted-content discovery (for Copilot grounding), and Entra Agent ID permissions are the main levers. Treat each agent like a privileged identity with its own data boundary.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'aws', 'google', 'custom', 'saas'],
  },

  // ---------- Protect AI Apps you build ----------
  {
    id: 'apps-secure-foundry',
    workloadCategory: 'apps',
    title: 'Secure a custom GenAI app you are building on Azure AI Foundry',
    shortTitle: 'Secure Foundry apps',
    shortDescription:
      'Identity, content safety, posture, and runtime threat protection for your own Foundry / Azure OpenAI app.',
    longDescription:
      'End-to-end coverage on Azure: Entra managed identities, Key Vault, Azure AI Content Safety Prompt Shields, Defender CSPM (Cloud Security Posture Management) for posture and attack-path, Defender for AI Services for runtime alerts, and Defender XDR / Sentinel for SOC integration.',
    applicablePlatformKinds: ['custom', 'openai', 'anthropic'],
  },
  {
    id: 'apps-content-safety',
    workloadCategory: 'apps',
    title: 'Block harmful content and prompt injection inside your AI app',
    shortTitle: 'Content safety & injection',
    shortDescription:
      'Apply content filtering, jailbreak detection, and indirect-prompt-injection shields to your own model calls.',
    longDescription:
      'Azure AI Content Safety Prompt Shields detect direct jailbreaks and indirect (document) prompt injection for Azure-hosted apps. Defender for AI Services consumes those signals to raise alerts. Outside Azure, you depend on vendor safety classifiers or a third-party prompt firewall.',
    applicablePlatformKinds: ['custom', 'openai', 'anthropic'],
  },
  {
    id: 'apps-rag-pipeline',
    workloadCategory: 'apps',
    title: 'Secure RAG / grounding pipelines feeding your AI app',
    shortTitle: 'Secure RAG pipelines',
    shortDescription:
      'Stop the model from ingesting overshared or sensitive data through the retrieval layer.',
    longDescription:
      'Defender for Cloud sensitive-data discovery, Purview classification on source stores, and SharePoint Advanced Management restricted-content discovery (for Copilot grounding) are the main levers. Treat the retrieval index as a privileged data store.',
    applicablePlatformKinds: ['microsoft', 'custom', 'openai', 'anthropic'],
  },

  // ---------- Protect AI Coding Assistants ----------
  {
    id: 'coding-prevent-ip-leak',
    workloadCategory: 'coding',
    title: 'Stop source, secrets, and IP from leaking to AI coding assistants',
    shortTitle: 'Prevent IP leak',
    shortDescription:
      'Protect proprietary code and credentials from being sent to GitHub Copilot, Claude Code, Cursor, Codeium, or Codex.',
    longDescription:
      'GitHub Copilot inherits enterprise policy from GitHub Advanced Security (secret scanning, push protection). Claude Code, Cursor, and Codeium are local IDE extensions with no Microsoft-native inspection - you depend on Defender for Endpoint, Intune app control, and third-party AI code-review tools (Lakera, GitGuardian) plus repo-side secret scanning.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },
  {
    id: 'coding-govern-tools',
    workloadCategory: 'coding',
    title: 'Govern which AI coding assistants developers can install and run',
    shortTitle: 'Govern coding assistants',
    shortDescription:
      'Allow-list approved IDE assistants; block unsanctioned ones at install or network egress.',
    longDescription:
      'Intune app control / WDAC (Windows Defender Application Control) + AppLocker decides which IDE extensions and desktop coding agents can install. Defender for Endpoint network protection plus GSA egress filtering decide which model endpoints (api.anthropic.com, api.openai.com, cursor.sh) those tools can reach.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },

  // ---------- Protect AI in SaaS / Embedded AI features ----------
  {
    id: 'saas-discover-embedded-ai',
    workloadCategory: 'saas-embedded',
    title: 'Discover AI features quietly turned on inside SaaS apps',
    shortTitle: 'Discover embedded AI',
    shortDescription:
      'Find Notion AI, Slack AI, Salesforce Einstein, Atlassian Intelligence, ServiceNow Now Assist, Zoom AI Companion, and friends.',
    longDescription:
      'Defender for Cloud Apps catalogs Generative AI SaaS and the AI features inside non-AI SaaS, with a risk score and sanction/unsanction action. Native SaaS-vendor admin controls are usually all you get for prompt content - a CASB (Cloud Access Security Broker) is required for visibility and policy enforcement across the portfolio.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },
  {
    id: 'saas-govern-embedded-ai',
    workloadCategory: 'saas-embedded',
    title: 'Govern what data SaaS-embedded AI can access from your tenant',
    shortTitle: 'Govern SaaS AI data',
    shortDescription:
      'Constrain which records, channels, and documents the SaaS AI feature can ground on.',
    longDescription:
      'Most enforcement happens in the SaaS vendor admin console. Microsoft can capture activity via Defender for Cloud Apps connectors and audit; Purview cannot label-enforce inside a third-party SaaS AI today. Combine vendor-side scoping with CASB session policies for inline control.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },

  // ---------- Protect AI Plugins, Connectors, and MCP servers ----------
  {
    id: 'plugins-govern-connectors',
    workloadCategory: 'plugins',
    title: 'Govern Copilot connectors, Copilot Studio actions, and custom GPTs',
    shortTitle: 'Govern connectors & actions',
    shortDescription:
      'Decide which connectors and actions Copilot and Copilot Studio are allowed to call.',
    longDescription:
      'Purview "Copilot experiences and agents" plus the Entra app gallery cover Microsoft-registered connectors and Copilot Studio actions. ChatGPT custom GPTs / Actions and Claude integrations sit outside that surface - govern via CASB plus identity-side consent policies.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom'],
  },
  {
    id: 'plugins-secure-mcp',
    workloadCategory: 'plugins',
    title: 'Secure Model Context Protocol (MCP) servers and AI plugins',
    shortTitle: 'Secure MCP servers',
    shortDescription:
      'Authenticate, scope, and monitor MCP servers that expose tools and data to AI agents.',
    longDescription:
      'MCP server security is nascent. Entra Global Secure Access can discover SaaS MCP servers in the Shadow AI report. For raw MCP servers there is no first-party Microsoft inspection - recommend network segmentation, mutual auth, and third-party MCP gateways or prompt firewalls.',
    applicablePlatformKinds: ['microsoft', 'custom', 'openai', 'anthropic'],
  },

  // ---------- Protect AI Infrastructure ----------
  {
    id: 'infra-azure-models',
    workloadCategory: 'infra',
    title: 'Secure Azure OpenAI and Azure AI Foundry model endpoints',
    shortTitle: 'Secure Azure models',
    shortDescription:
      'Lock down model deployments, private endpoints, and content-safety policies on Azure.',
    longDescription:
      'Defender for AI Services (GA May 1, 2025) covers Azure OpenAI and Azure AI Model Inference text tokens in commercial clouds - no Azure Government, 21Vianet, or AWS. Defender CSPM gives posture and attack-path. Use private endpoints, customer-managed keys, and Content Safety policies on every deployment.',
    applicablePlatformKinds: ['custom'],
  },
  {
    id: 'infra-non-azure-models',
    workloadCategory: 'infra',
    title: 'Secure non-Azure model hosting and partner model endpoints',
    shortTitle: 'Secure non-Azure models',
    shortDescription:
      'Protect Anthropic API, OpenAI API, Bedrock, or self-hosted models you cannot put behind Defender for AI Services.',
    longDescription:
      'Defender for AI Services does not apply outside Azure. Compensate with third-party prompt firewalls (CalypsoAI, Cisco AI Defense (formerly Robust Intelligence), Lakera Guard, Protect AI - listed alphabetically), front the model via Azure AI Model Inference when possible, and ingest vendor audit into Sentinel.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },

  // ---------- Protect AI APIs and Service-to-Service Access ----------
  {
    id: 'apis-secure-keys',
    workloadCategory: 'apis',
    title: 'Authenticate AI API access with managed identities, not embedded keys',
    shortTitle: 'Managed identities for keys',
    shortDescription:
      'Replace embedded API keys with managed identities and centralized secret management.',
    longDescription:
      'For Azure-hosted AI use Entra managed identities, Key Vault, and Defender for Key Vault. For direct Anthropic or OpenAI API calls store keys in Key Vault, restrict egress at the network layer, and use GitHub Advanced Security secret scanning to catch leaks in source.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom'],
  },
  {
    id: 'apis-agent-to-agent',
    workloadCategory: 'apis',
    title: 'Govern agent-to-agent and MCP-server authentication',
    shortTitle: 'Agent-to-agent auth',
    shortDescription:
      'Give agents their own identity and authorize tool calls instead of sharing user tokens.',
    longDescription:
      'Entra Agent ID provides per-agent identity; Agent 365 carries authorization context for Microsoft and pre-integrated agents. For MCP-server-to-agent and agent-to-agent paths outside the Microsoft surface, use OAuth client credentials, mTLS, and a gateway - first-party Microsoft inspection is limited today.',
    applicablePlatformKinds: ['microsoft', 'custom', 'openai', 'anthropic'],
  },

  // ---------- Protect AI Training, Fine-tuning, and Grounding Data ----------
  {
    id: 'data-classify-grounding',
    workloadCategory: 'data',
    title: 'Classify and label data before AI grounding, fine-tuning, or training',
    shortTitle: 'Classify grounding data',
    shortDescription:
      'Make sure sensitive data is identified and labeled before Copilot, RAG, or a fine-tune ever sees it.',
    longDescription:
      'Sensitivity labels and encryption are enforced for Microsoft 365 Copilot. For Foundry / Azure OpenAI grounding, apply Defender for Cloud sensitive-data discovery on source stores and Purview classification.',
    applicablePlatformKinds: ['microsoft', 'custom', 'anthropic'],
  },
  {
    id: 'data-protect-finetune',
    workloadCategory: 'data',
    title: 'Protect fine-tuning and custom-embedding datasets',
    shortTitle: 'Protect fine-tune data',
    shortDescription:
      'Lock down the training corpus, vector index, and fine-tune artifacts so they cannot be exfiltrated or poisoned.',
    longDescription:
      'Treat the dataset and the resulting model weights as crown-jewel data: Defender for Storage on the source containers, customer-managed keys on the index, Entra-scoped access, and audit on all read/write paths. Microsoft has no first-party data-poisoning detector - manual data-quality review still applies. Note: fine-tuning of third-party hosted models (Anthropic, direct OpenAI) is outside Microsoft\u2019s coverage; this use case targets Microsoft-hosted (Foundry / Azure OpenAI) and custom-built training pipelines.',
    applicablePlatformKinds: ['microsoft', 'custom'],
  },

  // ---------- Protect against Shadow / Unsanctioned AI ----------
  {
    id: 'shadow-discover-ai',
    workloadCategory: 'shadow',
    title: 'Discover shadow / unsanctioned AI usage across the org',
    shortTitle: 'Discover shadow AI',
    shortDescription:
      'Find which AI tools users and apps are actually reaching from your tenant - browser, desktop, and personal account.',
    longDescription:
      'Entra Global Secure Access Shadow AI discovery explicitly identifies ChatGPT, Claude SaaS, SaaS MCP servers, the Anthropic Claude API, and DeepSeek. Defender for Cloud Apps surfaces Generative AI category usage with a risk score. Desktop apps and personal-account usage still depend on Defender for Endpoint and network egress visibility.',
    applicablePlatformKinds: ['openai', 'anthropic', 'custom', 'saas'],
  },

  // ---------- Protect against AI-Generated Threats to your users ----------
  {
    id: 'ai-threats-phishing',
    workloadCategory: 'ai-threats',
    title: 'Defend users from AI-generated phishing, deepfakes, and synthetic identity',
    shortTitle: 'AI phishing & deepfakes',
    shortDescription:
      'Stop AI-crafted lures, voice clones, and synthetic-identity attacks at the inbox, browser, and identity layer.',
    longDescription:
      'Defender for Office 365, Defender for Endpoint, and Entra ID Protection do not change because the attacker uses GenAI - but volume and sophistication go up. The control story is the existing Microsoft Defender XDR stack plus user awareness and stricter sign-in risk policies.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom'],
  },
  {
    id: 'ai-threats-external-injection',
    workloadCategory: 'ai-threats',
    title: 'Detect indirect prompt injection from external content',
    shortTitle: 'Indirect prompt injection',
    shortDescription:
      'Stop attacker-controlled documents, emails, and web pages from hijacking your AI app or agent.',
    longDescription:
      'Azure AI Content Safety Prompt Shields detect indirect (document) prompt injection for Azure-hosted apps; Defender for AI Services consumes those signals. For non-Azure AI surfaces (ChatGPT, Claude.ai), Microsoft does not inspect prompts in-line - compensate with vendor safety classifiers or a third-party prompt firewall.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom'],
  },

  // ---------- Govern AI lifecycle and compliance ----------
  {
    id: 'govern-framework-mapping',
    workloadCategory: 'govern',
    title: 'Map AI controls to NIST AI RMF, ISO/IEC 42001, and the EU AI Act',
    shortTitle: 'Framework mapping',
    shortDescription:
      'Show auditors and the board which Microsoft controls satisfy which AI framework objectives.',
    longDescription:
      'Microsoft Purview Compliance Manager ships templates and assessments for NIST AI RMF, ISO/IEC 42001, and the EU AI Act, and tracks evidence against the Microsoft controls you have implemented.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom', 'saas'],
  },
  {
    id: 'govern-audit-lifecycle',
    workloadCategory: 'govern',
    title: 'Audit, investigate, and apply lifecycle policy to all AI interactions',
    shortTitle: 'Audit & lifecycle',
    shortDescription:
      'One audit, retention, and investigation surface across Copilot, ChatGPT, Claude, custom apps, and agents.',
    longDescription:
      'Microsoft 365 Unified Audit records AIAppInteraction, AIApp, and ConnectedAiAppInteraction events. Copilot audit is included; non-Microsoft AI audit uses pay-as-you-go billing with 180-day retention. Coverage of prompt content for "Other AI apps" depends on the Edge browser extension reaching the app. Pair with Purview Data Lifecycle Management and eDiscovery.',
    applicablePlatformKinds: ['microsoft', 'openai', 'anthropic', 'custom', 'saas'],
  },
]
