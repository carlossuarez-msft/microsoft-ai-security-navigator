import type { Platform } from '../types/content'

// Each platform card answers: "How do I secure THIS GenAI tool using Microsoft security?"
// Microsoft claims are validated against Microsoft Learn (see sources.ts).
// Vendor-specific (OpenAI/Anthropic) claims are summarized from public vendor docs
// and should be re-validated against the OpenAI Enterprise Privacy / Anthropic
// Trust Center pages before each public release.
//
// Note on third-party vendor lists in this file: where multiple vendors are listed
// they are in alphabetical order (listed alphabetically, not in priority order).

export const platforms: Platform[] = [
  {
    id: 'm365-copilot',
    name: 'Microsoft 365 Copilot',
    kind: 'microsoft',
    applicableWorkloads: ['chat', 'data', 'ai-threats', 'govern'],
    summary:
      'Microsoft\u2019s first-party productivity copilot. Microsoft Purview, Microsoft Entra, Defender, and Intune controls apply natively across the full set of lanes.',
    microsoftCoverage: 'High',
    nativeControls: [
      'Microsoft Entra ID SSO and Conditional Access (native)',
      'Honors Microsoft 365 sensitivity labels and label-based encryption end-to-end',
      'Prompts and responses captured in Microsoft 365 Unified Audit Log (Audit Standard \u2014 no extra billing)',
      'Tenant data isolation; customer data not used to train foundation models',
    ],
    playbook: {
      discover: [
        {
          tool: 'Microsoft 365 admin center \u2192 Copilot reports',
          action: 'Inventory licensed users, agent usage, and adoption.',
          status: 'GA',
        },
        {
          tool: 'Microsoft Purview Data Security Posture Management (DSPM) for AI',
          action: 'Run a Copilot data risk assessment to find oversharing in SharePoint sites Copilot can index.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'data', 'govern'],
        },
      ],
      accessControl: [
        {
          tool: 'Microsoft Entra Conditional Access',
          action: 'Require compliant device + MFA for Copilot access; gate by user risk and sign-in risk.',
          status: 'GA',
        },
        {
          tool: 'Microsoft Intune device compliance',
          action: 'Block Copilot from non-compliant or unmanaged devices.',
          status: 'GA',
        },
      ],
      dataProtection: [
        {
          tool: 'Purview sensitivity labels + label-based encryption',
          action: 'Apply labels to sensitive content; Copilot honors label permissions and encryption end-to-end.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'data'],
        },
        {
          tool: 'Microsoft Purview DLP for Microsoft 365 Copilot',
          action: 'Prevent Copilot from summarizing or grounding on files that carry the sensitivity labels you specify. Authored via DSPM for AI one-click policies or DLP policy designer.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'data'],
        },
        {
          tool: 'SharePoint Advanced Management restricted-content discovery',
          action: 'Identify and remediate oversharing before broad Copilot rollout.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'data'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Purview Audit + Activity Explorer (AI activities tab)',
          action: 'Search Copilot prompts and responses; correlate to accessed files and labels.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'govern'],
        },
        {
          tool: 'Purview Insider Risk Management',
          action: 'Detect risky AI usage patterns and unethical-behavior signals.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'ai-threats'],
        },
        {
          tool: 'Defender XDR + Sentinel + Security Copilot',
          action: 'Correlate Copilot signals with identity, endpoint, and email events into one incident.',
          status: 'GA',
          appliesToWorkloads: ['ai-threats', 'govern'],
        },
      ],
      govern: [
        {
          tool: 'Purview eDiscovery',
          action: 'Search, hold, and produce Copilot interactions for regulatory or legal cases.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Purview Data Lifecycle Management (retention)',
          action: 'Retain Copilot interactions per regulatory requirements.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Microsoft Agent 365',
          action: 'Govern Copilot Studio agents alongside third-party agents.',
          status: 'GA',
          gaDate: '2026-05-01',
          appliesToWorkloads: ['govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'Copilot can still surface anything a user is technically permissioned to see \u2014 oversharing remediation in SharePoint must be handled by your organization, not by the product.',
        compensatingControl: 'process',
        suggestion: 'Run SharePoint Advanced Management restricted-content discovery before broad rollout and remediate excessive permissions.',
        layer: 'data',
        appliesToWorkloads: ['chat', 'data'],
      },
      {
        gap: 'Inline jailbreak / prompt-injection defense is internal to Microsoft\u2019s service; custom guardrails per tenant are limited.',
        compensatingControl: 'process',
        suggestion: 'Layer user training and acceptable-use policy; monitor Purview Audit for jailbreak attempts and route to Insider Risk Management.',
        layer: 'app',
        appliesToWorkloads: ['ai-threats', 'chat'],
      },
    ],
    sourceIds: ['purview-ai', 'audit-copilot', 'agent-365-overview'],
  },
  {
    id: 'copilot-studio',
    name: 'Microsoft Copilot Studio',
    kind: 'microsoft',
    applicableWorkloads: ['agents', 'plugins', 'data', 'ai-threats', 'govern'],
    summary:
      "Microsoft\u2019s low-code platform for building agents and customizing Microsoft 365 Copilot. Authoring, knowledge sources, topics, and authentication are managed in the Copilot Studio environment; runtime governance flows through Microsoft Purview and Microsoft Entra agent identity.",
    microsoftCoverage: 'High',
    nativeControls: [
      'Power Platform data loss prevention (DLP) policies on connectors used by Copilot Studio agents',
      'Power Platform environment groups and environment-level isolation per workload',
      'Agent-level data loss prevention authored inside Copilot Studio',
      'Knowledge source connection security (SharePoint, Dataverse, websites) with per-source authentication',
      'Microsoft Entra agent identity (Agent 365 alignment, scheduled GA on 1 May 2026)',
      'Purview DSPM for AI visibility into Copilot Studio agents',
    ],
    playbook: {
      discover: [
        {
          tool: 'Microsoft Purview Data Security Posture Management (DSPM) for AI',
          action: 'Catalog Copilot Studio agents and the sensitive data they ground on; flag risky combinations.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'data', 'govern', 'ai-threats'],
        },
        {
          tool: 'Power Platform admin center \u2192 environments and agent inventory',
          action: 'Inventory environments, agents, and connector usage across the tenant.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'plugins'],
        },
      ],
      accessControl: [
        {
          tool: 'Microsoft Entra agent identity (Agent 365 alignment)',
          action: 'Give every Copilot Studio agent a first-class Entra identity (scheduled GA on 1 May 2026).',
          status: 'GA',
          gaDate: '2026-05-01',
          appliesToWorkloads: ['agents'],
        },
        {
          tool: 'Microsoft Entra Conditional Access on agent identities and Power Platform',
          action: 'Require compliant device, MFA, and group scoping for authors and runtime callers of Copilot Studio agents.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'plugins'],
        },
        {
          tool: 'Power Platform conditional access',
          action: 'Block makers and runtime users from non-compliant networks or devices.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'plugins'],
        },
      ],
      dataProtection: [
        {
          tool: 'Microsoft Purview sensitivity labels and DLP on grounded sources',
          action: 'Honor sensitivity labels on SharePoint, OneDrive, and Dataverse data that Copilot Studio agents ground on.',
          status: 'GA',
          appliesToWorkloads: ['data', 'agents', 'plugins'],
        },
        {
          tool: 'Power Platform DLP policies',
          action: 'Separate business and non-business connectors so Copilot Studio agents cannot bridge sensitive sources to external destinations.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'plugins', 'data'],
        },
        {
          tool: 'Agent-level data loss prevention',
          action: 'Constrain what data a specific agent can request, summarize, or surface to end users.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'plugins', 'data'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Microsoft Purview Audit',
          action: 'Captured automatically in Audit (Standard); search by `AppIdentity` values starting with `Copilot.Studio.` (declarative and custom-engine agents) and `AgentId` values prefixed `CopilotStudio.Declarative.*` / `CopilotStudio.CustomEngine.*` \u2014 see Microsoft Learn `audit-copilot`.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'govern', 'data', 'ai-threats', 'plugins'],
        },
        {
          tool: 'Microsoft Purview Insider Risk Management \u2014 Risky AI usage',
          action: 'Detect risky prompt patterns and unethical-behavior signals from Copilot Studio agents.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'ai-threats', 'plugins'],
        },
        {
          tool: 'Microsoft Defender XDR + Sentinel',
          action: 'Correlate Copilot Studio signals with identity, endpoint, and email events into a single incident.',
          status: 'GA',
          appliesToWorkloads: ['ai-threats'],
        },
      ],
      govern: [
        {
          tool: 'Microsoft Purview Compliance Manager',
          action: 'Track Copilot Studio control coverage against AI regulation templates (NIST AI RMF, ISO/IEC 42001, EU AI Act).',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Power Platform Center of Excellence (CoE) starter kit',
          action: 'Maintain a tenant-side catalog of Copilot Studio agents with owners, makers, environments, and review cadence.',
          status: 'GA',
          appliesToWorkloads: ['agents', 'govern'],
        },
        {
          tool: 'Microsoft Purview Communication Compliance',
          action: 'Review Copilot Studio agent interactions for policy concerns where supported.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'Third-party connector risk \u2014 a Copilot Studio agent can call a custom or certified connector to a non-Microsoft service that is not in the Purview DLP / sensitivity-label scope.',
        compensatingControl: 'process',
        suggestion: 'Restrict the connector catalog via Power Platform DLP business / non-business split; require security review before certifying a custom connector for production agents.',
        layer: 'app',
        appliesToWorkloads: ['agents', 'plugins', 'data'],
      },
      {
        gap: 'Prompt injection on knowledge sources \u2014 attacker-supplied content in a grounded SharePoint document or website can hijack a Copilot Studio agent.',
        compensatingControl: 'process',
        suggestion: 'Front the agent with Azure AI Content Safety Prompt Shields where the call path supports it; isolate untrusted knowledge sources to read-only summarization with explicit guardrail prompts.',
        layer: 'app',
        compensatingVendors: ['Azure AI Content Safety Prompt Shields'],
        appliesToWorkloads: ['ai-threats', 'agents'],
      },
      {
        gap: 'Agent identity is per-tenant but cross-tenant agent-to-agent calls require the Agent 365 pre-integration list (scheduled GA on 1 May 2026).',
        compensatingControl: 'process',
        suggestion: 'Treat cross-tenant agent calls as exceptions until Agent 365 GA; maintain a sanctioned-partner-agent list with manual onboarding.',
        layer: 'identity',
        appliesToWorkloads: ['agents'],
      },
    ],
    sourceIds: ['copilot-studio-overview', 'purview-ai', 'audit-copilot', 'agent-365-overview'],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    kind: 'microsoft',
    applicableWorkloads: ['coding', 'govern'],
    summary:
      "GitHub Copilot is GitHub\u2019s AI pair programmer (Copilot for individuals, Business, Enterprise). Enterprise tenants control content exclusions, IP indemnity, and audit through GitHub Enterprise Cloud; Microsoft Defender and Purview integration is partial today and primarily flows via Microsoft Defender for Cloud DevOps security and GitHub Advanced Security.",
    microsoftCoverage: 'Medium',
    nativeControls: [
      'GitHub Copilot content exclusions (vendor-native) at the org / repo / path level',
      'GitHub Copilot IP indemnity for Business / Enterprise tiers (vendor terms)',
      'GitHub Enterprise Cloud audit log for Copilot events',
      'GitHub Advanced Security \u2014 secret scanning, code scanning, push protection',
      'SAML SSO + SCIM provisioning via Microsoft Entra ID',
      'GitHub-hosted models with org-level audit',
    ],
    playbook: {
      discover: [
        {
          tool: 'Microsoft Defender for Cloud Apps \u2192 app connector for GitHub',
          action: 'Bring GitHub Enterprise Cloud activity into the CASB; sanction or unsanction by org and risk score.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
        {
          tool: 'Microsoft Defender for Cloud DevOps security \u2014 inventory',
          action: 'Discover GitHub orgs, repos, and code-to-cloud findings tied to Copilot-enabled developers.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
      ],
      accessControl: [
        {
          tool: 'Microsoft Entra ID SAML SSO + SCIM provisioning to GitHub Enterprise Cloud',
          action: 'Federate GitHub to Entra; scope Copilot licenses by group; require MFA and compliant device through Conditional Access.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
        {
          tool: 'Microsoft Entra Conditional Access',
          action: 'Gate GitHub access by user risk, sign-in risk, device compliance, and named locations.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
        {
          tool: 'Microsoft Intune device compliance',
          action: 'Block Copilot from non-compliant or unmanaged developer endpoints via Conditional Access.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
      ],
      dataProtection: [
        {
          tool: 'GitHub Copilot content exclusions',
          action: 'Configure repo / path / file-pattern exclusions so Copilot never reads sensitive code as grounding context.',
          status: 'GA',
          appliesToWorkloads: ['coding'],
        },
        {
          tool: 'Microsoft Purview Endpoint DLP + Browser/Network data security',
          action: 'Restrict uploads of classified content to github.com from managed endpoints via Endpoint DLP service-domain rules and Purview browser/network data security policies.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
        {
          tool: 'GitHub Advanced Security \u2014 secret scanning + push protection',
          action: 'Block secrets and credentials from being committed; detect leaks already in history.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Microsoft Sentinel data connector for GitHub',
          action: 'Forward GitHub Enterprise audit log (including Copilot events) into Sentinel for correlation and long-term retention.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
        {
          tool: 'Microsoft Defender for Cloud DevOps security \u2014 findings',
          action: 'Surface code-scanning and secret-scanning alerts on Copilot-touched repos into the Defender XDR incident view.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
        {
          tool: 'Microsoft Defender XDR',
          action: 'Stitch identity, endpoint, and DevOps signals around Copilot-enabled developers into one incident.',
          status: 'GA',
          appliesToWorkloads: ['coding', 'govern'],
        },
      ],
      govern: [
        {
          tool: 'Microsoft Purview Compliance Manager',
          action: 'Track GitHub control coverage against your existing AI regulation templates (NIST AI RMF / ISO/IEC 42001) in Microsoft Purview Compliance Manager.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'GitHub Advanced Security policies',
          action: 'Standardize secret-scanning, code-scanning, and push-protection enforcement org-wide.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'GitHub Copilot IP indemnity (vendor terms)',
          action: 'Confirm Business / Enterprise plan IP indemnity and acceptable-use boundaries with legal before broad rollout.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'GitHub Copilot prompt content is not in Microsoft Purview Audit \u2014 it lives in the GitHub Enterprise audit log only.',
        compensatingControl: 'process',
        suggestion: 'Ingest the GitHub Enterprise audit log into Microsoft Sentinel via the GitHub data connector; treat the GitHub audit as the source of truth for Copilot prompt activity.',
        layer: 'govern',
      },
      {
        gap: 'Microsoft Purview sensitivity labels are not evaluated against GitHub Copilot suggestions today \u2014 enforcement happens at the repo via content exclusions, not at the prompt.',
        compensatingControl: 'process',
        suggestion: 'Combine Copilot content exclusions on sensitive paths with repo-level access controls; document the gap so customers do not assume Purview labels reach Copilot suggestions.',
        layer: 'data',
      },
      {
        gap: 'Secrets-in-prompts inspection at the IDE layer is not a Microsoft control \u2014 it requires GitHub Advanced Security push protection and secret scanning.',
        compensatingControl: 'process',
        suggestion: 'Mandate GHAS push protection + secret scanning on every Copilot-enabled org; pair with Endpoint DLP for endpoint-side credential exfiltration.',
        layer: 'endpoint',
      },
    ],
    sourceIds: ['github-copilot-docs', 'sentinel-github-connector'],
  },
  {
    id: 'chatgpt-enterprise',
    name: 'ChatGPT Enterprise (OpenAI)',
    kind: 'openai',
    applicableWorkloads: ['chat', 'shadow', 'ai-threats', 'govern'],
    summary:
      'OpenAI\u2019s enterprise plan. Among non-Microsoft AI apps, has the broadest Purview integration today: prompts and responses flow into Purview audit, Microsoft Purview Data Security Posture Management (DSPM) for AI, classification, Insider Risk Management, eDiscovery, and Communication Compliance. The hard limit is enforcement: no enforced sensitivity labels, no encryption-on-labels, and no in-line DLP via Microsoft.',
    microsoftCoverage: 'Medium',
    nativeControls: [
      'SAML SSO (vendor-side); workspace isolation; data not used to train models by default [Vendor \u2014 validate]',
      'Vendor admin console with workspace audit and member management [Vendor \u2014 validate]',
      'OpenAI safety classifiers and usage policies are vendor-internal; ChatGPT Enterprise does not expose a tenant-configurable safety control surface today. [Vendor \u2014 validate against the OpenAI Trust Center.]',
      'No native Microsoft sensitivity-label enforcement',
    ],
    playbook: {
      discover: [
        {
          tool: 'Microsoft Defender for Cloud Apps \u2192 Cloud app catalog',
          action: 'Filter App category = Generative AI to see ChatGPT Enterprise usage and risk score; sanction the app.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
        {
          tool: 'Purview DSPM for AI \u2192 Enterprise AI apps view',
          action: 'See sensitive prompts and responses, top users, and trending sensitive information types (SITs).',
          status: 'GA',
          appliesToWorkloads: ['chat', 'govern'],
        },
        {
          tool: 'Microsoft Entra Global Secure Access \u2014 Shadow AI Discovery',
          action: 'See which users hit chat.openai.com from managed devices and confirm sanctioned ChatGPT Enterprise routing vs. unsanctioned consumer paths.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      accessControl: [
        {
          tool: 'Microsoft Entra ID (SAML SSO) + Conditional Access',
          action: 'Federate the ChatGPT Enterprise workspace to Entra; require compliant device and MFA; gate by group.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
        {
          tool: 'Entra access reviews',
          action: 'Periodically recertify ChatGPT Enterprise license assignments and admin roles.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'govern'],
        },
      ],
      dataProtection: [
        {
          tool: 'Purview Data Classification (sensitive information types and trainable classifiers)',
          action: 'Identify sensitive data in ChatGPT Enterprise prompts and responses inside Activity Explorer.',
          status: 'GA',
          appliesToWorkloads: ['chat'],
        },
        {
          tool: 'Purview Insider Risk Management \u2014 Risky AI usage policy template',
          action: 'Treat risky ChatGPT Enterprise activity (e.g., sensitive paste from a leaver) as an insider-risk signal.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'ai-threats'],
        },
        {
          tool: 'Compensating control \u2014 process',
          action:
            'Purview does not support sensitivity labels, label-based encryption, or in-line DLP for ChatGPT Enterprise. Enforce data-handling rules at the user-training and policy layer and review with Insider Risk Management after-the-fact.',
          caveat: 'No enforcement plane via Microsoft today.',
        },
      ],
      monitorRespond: [
        {
          tool: 'Purview Unified Audit Log + Activity Explorer',
          action: 'Investigate ChatGPT Enterprise prompts/responses; retain 180 days under pay-as-you-go billing.',
          status: 'GA',
          caveat: 'Non-Microsoft AI audit logs use pay-as-you-go billing (recordTypes `AIAppInteraction` and `ConnectedAiAppInteraction`; workload `AIApp`).',
          appliesToWorkloads: ['chat', 'govern', 'shadow'],
        },
        {
          tool: 'Purview Communication Compliance',
          action: 'Review ChatGPT Enterprise interactions for policy concerns.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'govern'],
        },
        {
          tool: 'Purview eDiscovery',
          action: 'Search, hold, and produce ChatGPT Enterprise interactions for legal cases.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Microsoft Defender for Cloud Apps anomaly detection',
          action: 'Detect anomalous ChatGPT Enterprise usage (volume spikes, off-hours, impossible travel) and promote to a Defender XDR incident.',
          status: 'GA',
          caveat: 'Generic SaaS UEBA (volume spikes, impossible travel) categorized under Generative AI \u2014 not an AI-native threat-detection surface. Defender for AI Services does not cover ChatGPT Enterprise; the prompt-injection / jailbreak defense story is internal to OpenAI.',
          appliesToWorkloads: ['ai-threats', 'shadow'],
        },
        {
          tool: 'Defender XDR + Sentinel',
          action: 'Stitch Purview DSPM for AI alerts with identity and endpoint events; promote to incidents.',
          status: 'GA',
          appliesToWorkloads: ['ai-threats'],
        },
      ],
      govern: [
        {
          tool: 'Purview Data Lifecycle Management',
          action: 'Apply retention to ChatGPT Enterprise interactions for regulatory requirements.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Purview Compliance Manager',
          action: 'Use ChatGPT Enterprise control-mapping templates to track AI regulation readiness.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'No sensitivity-label enforcement, no encryption-on-labels, and no in-line Purview DLP on ChatGPT Enterprise prompts.',
        compensatingControl: 'third-party',
        suggestion: 'Layer an AI-DLP gateway in front of chat.openai.com to enforce data-handling rules at submission time.',
        layer: 'data',
        compensatingVendors: ['Netskope', 'Palo Alto AI Access Security', 'Zscaler'],
        appliesToWorkloads: ['chat'],
      },
      {
        gap: 'Microsoft can detect and investigate but cannot block a sensitive prompt at submission time \u2014 compensate with IRM, policy, and training.',
        compensatingControl: 'process',
        suggestion: 'Publish an acceptable-use policy and configure Insider Risk Management to flag sensitive prompt submissions for review.',
        layer: 'govern',
      },
      {
        gap: 'OpenAI custom-GPT / GPT Store governance is vendor-side only.',
        compensatingControl: 'process',
        suggestion: 'Maintain a tenant-side allow-list of custom GPTs; review the OpenAI admin console quarterly.',
        layer: 'govern',
        appliesToWorkloads: ['govern'],
      },
      {
        gap: 'Defender for AI Services does not cover ChatGPT Enterprise \u2014 there is no Microsoft-native AI-threat surface for jailbreak / prompt-injection detection on this app; OpenAI safety classifiers are vendor-internal.',
        compensatingControl: 'third-party',
        suggestion: 'Layer an AI-DLP / prompt-firewall gateway (alphabetized: Cisco AI Defense, Lakera Guard, Protect AI) in front of chat.openai.com for jailbreak / prompt-injection detection.',
        layer: 'app',
        compensatingVendors: ['Cisco AI Defense (formerly Robust Intelligence)', 'Lakera Guard', 'Protect AI'],
        appliesToWorkloads: ['ai-threats'],
      },
    ],
    sourceIds: ['purview-chatgpt-enterprise', 'audit-copilot', 'dfca-shadow-ai', 'purview-ai'],
  },
  {
    id: 'chatgpt-consumer',
    name: 'ChatGPT (consumer / Free / Plus / Team)',
    kind: 'openai',
    applicableWorkloads: ['chat', 'shadow', 'govern'],
    summary:
      'Non-enterprise OpenAI tiers reached via chat.openai.com. There is no Purview-side integration; everything Microsoft does is at the browser, endpoint, and network layer. Treat as shadow AI by default.',
    microsoftCoverage: 'Medium',
    nativeControls: [
      'OpenAI account-level controls only \u2014 no enterprise admin plane in your tenant',
      'Vendor data-use settings (training opt-out) depend on plan and user toggle [Vendor \u2014 validate]',
    ],
    playbook: {
      discover: [
        {
          tool: 'Entra Global Secure Access \u2192 Shadow AI discovery',
          action: 'See which users hit chat.openai.com from managed devices, with risk score and usage volume.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Defender for Cloud Apps \u2192 Generative AI category',
          action: 'Tag chat.openai.com as Unsanctioned to route to enforcement.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      accessControl: [
        {
          tool: 'GSA web content filtering \u2014 Artificial Intelligence category',
          action: 'Block or warn on the AI category by user group via a Conditional Access policy.',
          status: 'GA',
          caveat: 'Validate FQDN coverage per tenant; combine with explicit URL allow/deny if needed.',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Conditional Access \u2192 session control',
          action: 'Scope ChatGPT consumer access to managed browser sessions only.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      dataProtection: [
        {
          tool: 'Purview Endpoint DLP + browser DLP (Edge)',
          action: 'Detect and block sensitive copy/paste and upload to chat.openai.com from managed endpoints.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
        {
          tool: 'Purview Network Data Security (via SSE/SASE)',
          action: 'Inspect sensitive content uploaded to chat.openai.com at the network layer.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
        {
          tool: 'Purview browser extension for DSPM for AI',
          action: 'Classify and audit prompts in Edge (and supported Chromium browsers) for "Other AI apps".',
          status: 'GA',
          appliesToWorkloads: ['chat', 'govern'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Purview Audit \u2192 Other AI apps',
          action: 'See user interactions captured via the browser extension; route to Insider Risk Management and eDiscovery.',
          status: 'GA',
          caveat: 'Retention for prompts is supported for ChatGPT (consumer) but only in the Edge browser \u2014 and only when a Purview Collection Policy with the option to capture content is configured.',
          appliesToWorkloads: ['chat', 'govern'],
        },
        {
          tool: 'Defender XDR',
          action: 'Correlate GSA, DfCA, and endpoint signals into a single shadow-AI incident.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      govern: [
        {
          tool: 'Acceptable-use policy + IRM',
          action: 'Publish an AI use policy; auto-detect violations with IRM templates.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow', 'govern'],
        },
        {
          tool: 'Purview Communication Compliance \u2014 Other AI apps',
          action: 'ChatGPT (consumer) is on the Microsoft-supported retention/CC/eDiscovery list \u2014 review captured prompts/responses for policy concerns when the Purview browser extension is deployed on Edge.',
          status: 'GA',
          caveat: 'Requires Edge browser + Purview Collection Policy capturing content.',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Purview eDiscovery \u2014 Other AI apps',
          action: 'Search, hold, and produce ChatGPT (consumer) interactions \u2014 ChatGPT is one of the four apps Microsoft explicitly supports for eDiscovery.',
          status: 'GA',
          caveat: 'Requires Edge browser + Purview Collection Policy capturing content.',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Purview Data Lifecycle Management \u2014 Other AI apps',
          action: 'Apply retention to ChatGPT (consumer) prompts captured via the Purview browser extension.',
          status: 'GA',
          caveat: 'Requires Edge browser + Purview Collection Policy capturing content.',
          appliesToWorkloads: ['govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'No tenant-level admin or audit on the OpenAI side for consumer/Team tiers.',
        compensatingControl: 'process',
        suggestion: 'Treat as shadow AI: discover via GSA + DfCA, then block or steer to ChatGPT Enterprise.',
        layer: 'govern',
      },
      {
        gap: 'No way to enforce Microsoft sensitivity labels.',
        compensatingControl: 'process',
        suggestion: 'Combine Endpoint DLP for copy/paste with user training; track label-bearing content exfiltration via IRM.',
        layer: 'data',
      },
      {
        gap: 'Mobile and BYOD coverage depends on Edge/Defender for Endpoint reach.',
        compensatingControl: 'third-party',
        suggestion: 'Front BYOD egress through an SSE/SASE provider with AI-aware DLP.',
        layer: 'network',
        compensatingVendors: ['Netskope', 'Palo Alto AI Access Security', 'Zscaler'],
      },
    ],
    sourceIds: ['gsa-shadow-ai', 'gsa-ai-category', 'dfca-shadow-ai', 'purview-other-ai-apps', 'audit-copilot'],
  },
  {
    id: 'claude-web',
    name: 'Claude.ai (Anthropic web)',
    kind: 'anthropic',
    applicableWorkloads: ['chat', 'shadow', 'govern'],
    summary:
      'Anthropic\u2019s browser-based product (Free, Pro, Team, Enterprise). Microsoft treats it as an "Other AI app": discoverable through GSA Shadow AI discovery and Defender for Cloud Apps; protectable via Purview DLP for "Other AI apps" at the browser/network layer.',
    microsoftCoverage: 'Medium',
    nativeControls: [
      'SAML SSO available on Enterprise plan [Vendor \u2014 validate Anthropic Trust Center]',
      'Workspace audit logs on Team / Enterprise plans (vendor-side) [Vendor \u2014 validate]',
      'Anthropic runtime safety classifiers (vendor-internal; not tenant-configurable) [Vendor \u2014 validate Anthropic Trust Center]',
      'Data not used to train models by default on commercial plans [Vendor \u2014 validate]',
    ],
    playbook: {
      discover: [
        {
          tool: 'Entra Global Secure Access \u2192 Shadow AI discovery',
          action: 'Microsoft Learn explicitly names Claude SaaS as a discovered AI app \u2014 see users hitting claude.ai.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Defender for Cloud Apps \u2192 Generative AI category',
          action: 'Sanction or unsanction claude.ai; review the risk score and compliance attributes.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      accessControl: [
        {
          tool: 'GSA web content filtering \u2192 AI category',
          action: 'Allow/warn/block claude.ai by Conditional Access scope (group-based).',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Entra SAML federation (if customer is on Claude Team / Enterprise)',
          action: 'Federate the Claude workspace to Entra; require Conditional Access and MFA.',
          status: 'GA',
          caveat: 'Requires a paid Anthropic plan that supports SAML SSO.',
          appliesToWorkloads: ['chat'],
        },
      ],
      dataProtection: [
        {
          tool: 'Purview DLP for "Other AI apps"',
          action: 'Block sensitive content from being submitted to claude.ai via browser/Edge or network integration.',
          status: 'GA',
          appliesToWorkloads: ['chat'],
        },
        {
          tool: 'Purview browser extension + Edge integration',
          action: 'Inspect and classify content typed/pasted into Claude.ai; surface in Activity Explorer.',
          status: 'GA',
          appliesToWorkloads: ['chat'],
        },
        {
          tool: 'Purview Endpoint DLP',
          action: 'Block sensitive copy/paste and file upload to Claude.ai from managed endpoints.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Purview Audit (Other AI apps) + IRM',
          action: 'Investigate sensitive interactions captured via browser/network; raise IRM cases.',
          status: 'GA',
          caveat:
            'Per Microsoft Purview docs, eDiscovery, Communication Compliance, and retention for prompts and responses are restricted to ChatGPT, Microsoft Chat (consumer version), Google Gemini, and DeepSeek \u2014 Claude is excluded from all three. Insider Risk and Audit do flow for Claude when the Purview browser extension is deployed on Edge.',
          appliesToWorkloads: ['chat', 'govern'],
        },
        {
          tool: 'Defender XDR + Sentinel',
          action: 'Correlate Claude.ai usage with identity, endpoint, email signals.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      govern: [
        {
          tool: 'Acceptable-use policy + Conditional Access',
          action: 'Restrict Claude.ai to a sanctioned-user group; treat other access as a policy violation.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow', 'govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'No enforced Microsoft sensitivity labels on Claude prompts.',
        compensatingControl: 'third-party',
        suggestion: 'Use a CASB (Cloud Access Security Broker) or AI-aware DLP gateway for inline enforcement, or restrict Claude.ai to a sanctioned-user group at the GSA layer.',
        layer: 'data',
        compensatingVendors: ['Netskope', 'Palo Alto AI Access Security', 'Zscaler'],
      },
      {
        gap: 'No Purview prompt retention for Claude today \u2014 Comm Compliance, eDiscovery, and retention are restricted to ChatGPT, Microsoft Chat (consumer), Gemini, and DeepSeek; Claude is excluded from all three.',
        compensatingControl: 'third-party',
        suggestion: 'Export audit from the Anthropic Trust Center / workspace API and ingest into Microsoft Sentinel; supplement with a third-party AI governance platform for prompt-level retention.',
        layer: 'govern',
        compensatingVendors: ['CalypsoAI', 'Lakera Guard', 'Protect AI'],
        appliesToWorkloads: ['govern', 'chat'],
      },
      {
        gap: 'Server-side admin/audit depends entirely on the vendor plan.',
        compensatingControl: 'process',
        suggestion: 'Require Claude Team / Enterprise plan for sanctioned use; document the vendor audit export pipeline.',
        layer: 'govern',
      },
    ],
    sourceIds: ['gsa-shadow-ai', 'dfca-shadow-ai', 'purview-other-ai-apps'],
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop (Anthropic native app)',
    kind: 'anthropic',
    applicableWorkloads: ['chat', 'shadow', 'govern'],
    summary:
      'Native Windows/macOS app from Anthropic. It does not run inside a browser, so Purview browser extension and Edge DLP do not see it. Microsoft coverage shifts to network egress (GSA + Defender for Endpoint network filtering), Endpoint DLP, and Intune app control. This is the most under-served surface in most environments.',
    microsoftCoverage: 'Low',
    nativeControls: [
      'Same Anthropic account model as Claude.ai \u2014 vendor SSO/audit on paid plans only [Vendor \u2014 validate]',
      'No browser-based controls apply',
    ],
    playbook: {
      discover: [
        {
          tool: 'Microsoft Intune \u2192 Discovered apps',
          action: 'See which managed endpoints have Claude Desktop installed; tag as managed/risky.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Defender for Endpoint \u2192 Software inventory',
          action: 'Identify Claude Desktop installations and process activity across the device fleet.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Microsoft Entra Global Secure Access (GSA) Shadow AI Discovery',
          action:
            'GSA names Anthropic Claude API as one of the discovered AI Model Provider frameworks. When devices are tunneled through GSA, outbound calls to api.anthropic.com from any source (including the Claude Desktop process) appear in GSA discovery; devices not on the GSA tunnel are not visible.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      accessControl: [
        {
          tool: 'Microsoft Intune app control / WDAC + AppLocker',
          action: 'Block install or execution of Claude Desktop on managed Windows endpoints if not sanctioned.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Defender for Endpoint network protection',
          action: 'Block egress to api.anthropic.com / claude.ai from non-sanctioned devices and user groups.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'GSA private/internet access policy',
          action: 'Apply identity-aware egress policy to Anthropic API hosts at the network layer.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
      ],
      dataProtection: [
        {
          tool: 'Purview Endpoint DLP',
          action:
            'Block sensitive copy/paste from labeled documents into Claude Desktop, and block sensitive file upload from managed endpoints.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
        {
          tool: 'Purview Network Data Security (via SSE/SASE)',
          action: 'Inspect sensitive payloads going to api.anthropic.com at the network layer.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
        {
          tool: 'Compensating control',
          action:
            'The Purview browser extension does not see Claude Desktop. Document this gap and rely on Endpoint DLP + network DLP. Educate users that desktop AI apps are not a labels/encryption bypass.',
          caveat: 'No browser-extension coverage for the native desktop client.',
        },
      ],
      monitorRespond: [
        {
          tool: 'Defender for Endpoint',
          action: 'Hunt on Claude Desktop process and network activity; build custom detections for risky patterns.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Sentinel \u2192 custom rules on GSA + DfE telemetry',
          action: 'Build a rule that fires on sustained sensitive data egress to api.anthropic.com.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Purview IRM',
          action: 'Use endpoint DLP and file-activity signals as inputs to insider-risk policies.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow'],
        },
      ],
      govern: [
        {
          tool: 'Sanctioned-AI catalog + Intune',
          action: 'Decide whether Claude Desktop is sanctioned; deliver consistently via Intune package or block it.',
          status: 'GA',
          appliesToWorkloads: ['shadow', 'govern'],
        },
        {
          tool: 'Acceptable-use policy',
          action: 'Make explicit that desktop AI apps fall under the same data-handling rules as browser AI.',
          status: 'GA',
          appliesToWorkloads: ['chat', 'shadow', 'govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'No Purview browser extension coverage \u2014 Edge-based Purview DSPM for AI flows do not apply.',
        compensatingControl: 'third-party',
        suggestion: 'Combine Endpoint DLP + Intune app control + network egress controls; consider a CASB or endpoint AI-DLP product with native Claude Desktop integration.',
        layer: 'endpoint',
        compensatingVendors: ['Netskope', 'Palo Alto AI Access Security', 'Zscaler'],
      },
      {
        gap: 'No prompt-level audit, classification, or retention via Microsoft for Claude Desktop.',
        compensatingControl: 'process',
        suggestion: 'Document the gap; sanction only Claude.ai in Edge if retention is mandatory, or use vendor-side audit export to Sentinel.',
        layer: 'govern',
      },
      {
        gap: 'BYOD / unmanaged devices are largely invisible unless the network path is centralized through GSA / SSE.',
        compensatingControl: 'third-party',
        suggestion: 'Front BYOD egress through an SSE/SASE provider; restrict Anthropic API hosts at the network layer.',
        layer: 'network',
        compensatingVendors: ['Netskope', 'Palo Alto AI Access Security', 'Zscaler'],
      },
      {
        gap: 'Outbound MCP server traffic from Claude Desktop is named in GSA Shadow AI discovery but enforcement is network-layer only.',
        compensatingControl: 'process',
        suggestion: 'Build a Sentinel rule on MCP-host egress patterns and route to the SOC for manual review.',
        layer: 'detect',
        appliesToWorkloads: ['shadow'],
      },
      {
        gap: 'Comm Compliance, eDiscovery, and retention for prompts are restricted to ChatGPT, Microsoft Chat (consumer), Gemini, and DeepSeek \u2014 Claude is excluded; Claude Desktop is doubly invisible because the Purview browser extension does not see it.',
        compensatingControl: 'process',
        suggestion: 'Document the restriction in the AI governance program; require vendor-side audit export from Anthropic to Sentinel for any sanctioned Claude Desktop use.',
        layer: 'govern',
        appliesToWorkloads: ['govern', 'chat'],
      },
    ],
    sourceIds: ['gsa-shadow-ai', 'dfca-shadow-ai', 'purview-other-ai-apps'],
  },
  {
    id: 'claude-api',
    name: 'Anthropic Claude API (server-to-server)',
    kind: 'anthropic',
    applicableWorkloads: ['agents', 'apps', 'plugins', 'apis', 'data', 'shadow', 'ai-threats', 'govern'],
    summary:
      'Developer-side use of Anthropic\u2019s API from custom apps, CI jobs, agent frameworks, MCP servers. Largely invisible to user-centric Microsoft controls. Best Microsoft option: front the model via Azure AI Model Inference so Defender for AI Services and Prompt Shields apply; otherwise rely on network egress controls and DevSecOps.',
    microsoftCoverage: 'Low',
    nativeControls: [
      'Anthropic API keys, workspace scoping, rate limits, and usage logs (vendor-side) [Vendor \u2014 validate]',
      'No tenant-side enterprise admin plane',
    ],
    playbook: {
      discover: [
        {
          tool: 'GSA Shadow AI discovery',
          action:
            'Microsoft Learn names the Anthropic Claude API as a discovered AI Model Provider framework \u2014 see which subnets / identities are calling it.',
          status: 'GA',
          appliesToWorkloads: ['shadow', 'apis'],
        },
        {
          tool: 'Defender for Cloud (CSPM) \u2014 cloud security explorer',
          action:
            'Query "AI workloads and models in use" to find Azure-hosted apps that call external AI providers, and AI BOM components.',
          status: 'GA',
          appliesToWorkloads: ['apps', 'apis', 'agents', 'plugins'],
        },
      ],
      accessControl: [
        {
          tool: 'Front the model via Azure AI Model Inference',
          action:
            'Where possible, consume Claude through Azure so identity, network, and Defender for AI Services controls apply.',
          status: 'GA',
          appliesToWorkloads: ['apis', 'apps', 'agents'],
        },
        {
          tool: 'Network egress controls (GSA / firewall / SSE)',
          action: 'Restrict api.anthropic.com egress to sanctioned subnets, service principals, and CI runners.',
          status: 'GA',
          appliesToWorkloads: ['apis', 'apps', 'shadow', 'plugins', 'data'],
        },
        {
          tool: 'Microsoft Entra Workload ID + Key Vault',
          action:
            'For apps that must call the Anthropic API directly, store keys in Key Vault and access via managed identity \u2014 never embed keys.',
          status: 'GA',
          appliesToWorkloads: ['apis', 'apps', 'plugins'],
        },
        {
          tool: 'Microsoft Defender for Cloud Apps \u2014 app instance catalog + Entra app consent restrictions',
          action: 'Inventory MCP tools / OAuth apps invoked from Claude-API agents; require admin consent for new app instances and revoke shadow plugin grants.',
          status: 'GA',
          appliesToWorkloads: ['plugins', 'agents'],
        },
      ],
      dataProtection: [
        {
          tool: 'Defender for Cloud sensitive-data discovery',
          action: 'Identify storage and DBs that feed RAG calls to Claude API; remove unintended exposure.',
          status: 'GA',
          appliesToWorkloads: ['data', 'apps'],
        },
        {
          tool: 'Microsoft Purview data classification on grounding and fine-tuning data sources',
          action: 'Classify and label SharePoint, OneDrive, Fabric, and Azure storage sources that feed prompts and RAG retrieval to the Anthropic API; flag sensitive sources before they reach the model.',
          status: 'GA',
          appliesToWorkloads: ['data', 'apps', 'agents'],
        },
        {
          tool: 'GitHub Advanced Security / secret scanning',
          action: 'Detect leaked Anthropic API keys in source code and pipelines.',
          status: 'GA',
          appliesToWorkloads: ['apis', 'apps', 'data'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Sentinel on network + firewall logs',
          action: 'Detect anomalous volume or off-hours egress to api.anthropic.com from server workloads.',
          status: 'GA',
          appliesToWorkloads: ['apis', 'shadow'],
        },
        {
          tool: 'Defender for AI Services (only if model is fronted via Azure AI Model Inference)',
          action:
            'Get jailbreak, wallet-abuse, credential-theft, and data-exposure alerts; route to XDR/Sentinel.',
          status: 'GA',
          caveat:
            'GA per Defender for Cloud product page (specific GA date is not surfaced on the current product page; consult Defender for Cloud release notes for the dated entry). Only applies when the model is consumed through Azure AI Model Inference. Direct calls to api.anthropic.com are out of scope.',
          appliesToWorkloads: ['apps', 'apis', 'agents', 'ai-threats'],
        },
      ],
      govern: [
        {
          tool: 'Sanctioned-model catalog + procurement',
          action:
            'Require that any direct Anthropic API use is registered, owned, and approved; otherwise route through Azure AI Model Inference.',
          status: 'GA',
          appliesToWorkloads: ['apps', 'apis', 'plugins', 'data'],
        },
        {
          tool: 'Microsoft Agent 365 (for pre-integrated partner agents)',
          action: 'Where third-party agents call Claude under the hood, govern via Agent 365 where supported (scheduled GA on 1 May 2026).',
          status: 'GA',
          gaDate: '2026-05-01',
          caveat: 'Coverage depends on the pre-integrated partner agent list.',
          appliesToWorkloads: ['agents'],
        },
      ],
    },
    gaps: [
      {
        gap: 'No prompt-content audit, classification, DLP, or retention via Microsoft for direct Anthropic API calls.',
        compensatingControl: 'third-party',
        suggestion: 'Front the model via Azure AI Model Inference, or deploy a prompt firewall in the app path.',
        layer: 'app',
        compensatingVendors: ['CalypsoAI', 'Cisco AI Defense (formerly Robust Intelligence)', 'Lakera Guard', 'Protect AI'],
        appliesToWorkloads: ['apps', 'apis', 'agents', 'data'],
      },
      {
        gap: 'No identity context for service-to-service API calls beyond what you instrument yourself.',
        compensatingControl: 'process',
        suggestion: 'Require managed identity + Key Vault for every Anthropic API caller; log call identity into Sentinel.',
        layer: 'identity',
        appliesToWorkloads: ['apis', 'apps'],
      },
      {
        gap: 'Defender for AI Services and Prompt Shields only apply when the model is consumed via Azure AI Model Inference.',
        compensatingControl: 'process',
        suggestion: 'Mandate Azure AI Model Inference for any sanctioned Anthropic usage; treat direct calls as exceptions requiring review.',
        layer: 'app',
      },
      {
        gap: 'Custom agent frameworks (LangChain, MCP, etc.) calling Claude directly are governed by the developer process, not by Microsoft tooling.',
        compensatingControl: 'third-party',
        suggestion: 'Deploy an MCP gateway / prompt firewall in the call path and ingest its audit into Microsoft Sentinel.',
        layer: 'app',
        compensatingVendors: ['CalypsoAI', 'Cisco AI Defense (formerly Robust Intelligence)', 'Lakera Guard', 'Protect AI'],
        appliesToWorkloads: ['agents', 'plugins'],
      },
      {
        gap: 'Defender for AI Services and Prompt Shields apply only when Anthropic models are consumed via Azure AI Model Inference; direct api.anthropic.com calls have no Microsoft-native threat protection.',
        compensatingControl: 'third-party',
        suggestion: 'Front the model via Azure AI Model Inference where possible; otherwise compensate with a prompt firewall (alphabetized: Cisco AI Defense, Lakera Guard, Protect AI).',
        layer: 'app',
        compensatingVendors: ['Cisco AI Defense (formerly Robust Intelligence)', 'Lakera Guard', 'Protect AI'],
        appliesToWorkloads: ['ai-threats'],
      },
    ],
    sourceIds: ['gsa-shadow-ai', 'defender-ai-services'],
  },
  {
    id: 'azure-foundry-custom',
    name: 'Custom AI on Microsoft Foundry (Azure AI Foundry)',
    kind: 'custom',
    applicableWorkloads: ['agents', 'apps', 'plugins', 'infra', 'apis', 'data', 'ai-threats', 'govern'],
    summary:
      'Customer-built GenAI apps and agents hosted on Azure (Azure OpenAI, Azure AI Model Inference, Microsoft Foundry (Azure AI Foundry) agents, custom RAG). Microsoft controls span posture, runtime threat protection, content safety, identity, and SOC integration \u2014 the broadest first-party coverage outside Microsoft 365 Copilot. Microsoft Foundry guardrails and content filters apply per deployment.',
    microsoftCoverage: 'High',
    nativeControls: [
      'Microsoft Entra ID + managed identities for service-to-service auth',
      'Azure Key Vault for secrets and customer-managed keys',
      'Azure AI Content Safety Prompt Shields (jailbreak + indirect prompt-injection detection)',
      'Foundry guardrails and content filters per deployment',
    ],
    playbook: {
      discover: [
        {
          tool: 'Defender CSPM \u2192 cloud security explorer',
          action:
            'Discover AI workloads, AI BOM components, vulnerable code repos provisioning Azure OpenAI, and risky containers.',
          status: 'GA',
          appliesToWorkloads: ['apps', 'infra', 'apis', 'agents', 'plugins'],
        },
        {
          tool: 'Defender CSPM attack path analysis',
          action: 'Identify toxic combinations (e.g., grounding data internet-exposed via lateral movement).',
          status: 'GA',
          appliesToWorkloads: ['apps', 'infra', 'data', 'ai-threats'],
        },
      ],
      accessControl: [
        {
          tool: 'Entra managed identities + RBAC',
          action: 'Replace embedded API keys with managed identities; apply least-privilege RBAC to Foundry resources.',
          status: 'GA',
        },
        {
          tool: 'Key Vault + Defender for Key Vault',
          action: 'Centralize and monitor secrets and customer-managed keys for AI workloads.',
          status: 'GA',
          appliesToWorkloads: ['infra', 'apis', 'plugins'],
        },
        {
          tool: 'Microsoft Defender for Cloud Apps \u2014 MCP server allow-list / Entra app catalogue',
          action: 'Catalogue and sanction MCP servers Foundry agents are allowed to call; treat unsanctioned MCP endpoints as shadow plugins. GSA Shadow AI Discovery names SaaS MCP servers as a discovered category.',
          status: 'GA',
          caveat: 'Enforcement is network/identity-layer via DfCA + Entra; there is no dedicated Foundry MCP allow-list control.',
          appliesToWorkloads: ['plugins', 'agents'],
        },
        {
          tool: 'Azure API Management \u2014 AI gateway for Azure OpenAI / Foundry endpoints',
          action: 'Front Azure OpenAI / Foundry inference endpoints behind APIM for per-consumer rate limiting, key rotation, subscription quotas, and Sentinel logging.',
          status: 'GA',
          appliesToWorkloads: ['apis', 'apps'],
        },
      ],
      dataProtection: [
        {
          tool: 'Azure AI Content Safety \u2192 Prompt Shields',
          action: 'Enable user-prompt and document-attack detection at the user-input and tool-response intervention points.',
          status: 'GA',
          appliesToWorkloads: ['apps', 'agents', 'ai-threats'],
        },
        {
          tool: 'Defender for Cloud sensitive-data discovery + Purview DSPM for AI',
          action: 'Find sensitive data exposed to grounding/fine-tuning paths; remediate before it reaches the model.',
          status: 'GA',
          appliesToWorkloads: ['data', 'apps', 'agents'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Microsoft Defender for AI Services',
          action:
            'Runtime alerts for jailbreak attempts, wallet abuse, data exposure, credential theft, suspicious access on Azure OpenAI and Azure AI Model Inference.',
          status: 'GA',
          caveat:
            'GA per Defender for Cloud product page (specific GA date is not surfaced on the current product page; consult Defender for Cloud release notes for the dated entry). Text tokens only; commercial cloud only (no Azure Government, 21Vianet, or connected AWS accounts).',
          appliesToWorkloads: ['apps', 'agents', 'ai-threats', 'apis', 'plugins', 'data'],
        },
        {
          tool: 'Defender for AI Services \u2014 Foundry agent threat protection',
          action: 'Runtime threat protection for Foundry-built AI agents.',
          status: 'Preview',
          caveat: 'Public preview; not GA. Track readiness before depending on it for production agents.',
          appliesToWorkloads: ['agents'],
        },
        {
          tool: 'Defender XDR + Sentinel + Security Copilot',
          action: 'Correlate AI workload alerts with identity, endpoint, and data signals; investigate as one incident.',
          status: 'GA',
          appliesToWorkloads: ['ai-threats'],
        },
      ],
      govern: [
        {
          tool: 'Microsoft Agent 365 + Entra Agent ID',
          action: 'Inventory Foundry agents, assign owners, and control identity (scheduled GA on 1 May 2026).',
          status: 'GA',
          gaDate: '2026-05-01',
          appliesToWorkloads: ['agents', 'govern'],
        },
        {
          tool: 'Agent 365 \u2014 Shadow AI for agents and agent-own-identity',
          action: 'Surface Shadow AI for agents and give agents their own identity (Frontier preview capabilities).',
          status: 'Preview',
          caveat: 'Frontier preview program enrollment required.',
          appliesToWorkloads: ['agents', 'govern'],
        },
        {
          tool: 'Compliance Manager + Purview policies',
          action: 'Track AI regulation control coverage; apply DLP/classification to Foundry data flows where supported.',
          status: 'GA',
          appliesToWorkloads: ['govern', 'data'],
        },
      ],
    },
    gaps: [
      {
        gap: 'Defender for AI Services does not cover image / audio tokens, Azure Government, 21Vianet, or AWS today.',
        compensatingControl: 'third-party',
        suggestion: 'For multi-modal or sovereign workloads, supplement with vendor-native logging into Sentinel and a third-party AI monitoring tool.',
        layer: 'detect',
        compensatingVendors: ['CalypsoAI', 'Lakera Guard', 'Protect AI'],
      },
      {
        gap: 'Threat protection for Foundry-built agents is in public preview, not GA.',
        compensatingControl: 'process',
        suggestion: 'Track GA readiness; require manual security review for production Foundry agents until GA.',
        layer: 'govern',
        appliesToWorkloads: ['agents'],
      },
      {
        gap: 'Third-party models consumed outside Azure AI Model Inference lose the Defender for AI Services overlay.',
        compensatingControl: 'process',
        suggestion: 'Mandate Azure AI Model Inference for any sanctioned third-party model; treat direct provider calls as exceptions.',
        layer: 'app',
        appliesToWorkloads: ['apps', 'apis', 'agents'],
      },
    ],
    sourceIds: ['defender-ai-services', 'agent-365-overview', 'apim-ai-gateway'],
  },
  {
    id: 'other-saas-ai-app',
    name: 'Other SaaS AI app (Notion AI, Slack AI, Salesforce Einstein, ServiceNow Now Assist, Atlassian Intelligence, Zoom AI Companion, Glean, \u2026)',
    kind: 'saas',
    applicableWorkloads: ['saas-embedded', 'shadow', 'govern'],
    summary:
      'The generic SaaS-embedded AI surface \u2014 vendor-embedded AI features inside Notion, Slack, Salesforce, ServiceNow, Atlassian, Zoom, Glean, and similar SaaS apps. Caveat: Purview, Defender for Cloud Apps, and GSA coverage applies only when the SaaS AI surface is on the relevant Microsoft supported-sites list \u2014 confirm per vendor before relying on any specific control. Microsoft control story is Microsoft Entra Global Secure Access Shadow AI Discovery + Microsoft Purview "Other AI apps" + Microsoft Defender for Cloud Apps + Microsoft Entra Conditional Access on the SaaS app\u2019s Entra Enterprise Application.',
    microsoftCoverage: 'Low',
    nativeControls: [
      'Vendor admin console toggles for the AI feature (granularity varies per SaaS) [Vendor \u2014 validate]',
      'Per-tenant feature toggles to disable AI features for parts of the org [Vendor \u2014 validate]',
      'Vendor AI privacy and training defaults (default opt-out / opt-in differs per vendor) [Vendor \u2014 validate]',
    ],
    playbook: {
      discover: [
        {
          tool: 'Microsoft Entra Global Secure Access \u2014 Shadow AI Discovery',
          action: 'See which users hit the SaaS app and its AI features from managed devices; review risk score and usage volume.',
          status: 'GA',
          appliesToWorkloads: ['shadow', 'govern'],
        },
        {
          tool: 'Microsoft Defender for Cloud Apps \u2014 Cloud app catalog',
          action: 'Filter the catalog by App category = Generative AI or by the specific SaaS app to see usage and risk; sanction or unsanction.',
          status: 'GA',
          appliesToWorkloads: ['saas-embedded', 'shadow', 'govern'],
        },
        {
          tool: 'Microsoft Purview DSPM for AI \u2014 Other AI apps insights',
          action: 'Surface "Other AI apps" interactions where the Purview browser extension or network integration can see them.',
          status: 'GA',
          caveat: 'Edge-only for the browser extension flow; native desktop SaaS clients are not in scope. Coverage is limited to apps on the Microsoft Purview supported-sites list \u2014 verify per vendor.',
          appliesToWorkloads: ['saas-embedded', 'govern'],
        },
      ],
      accessControl: [
        {
          tool: 'Microsoft Entra Conditional Access on the SaaS app Enterprise Application',
          action: 'Federate the SaaS app to Entra; require compliant device + MFA; scope AI-feature use by group via the SaaS app\u2019s Entra Enterprise Application object.',
          status: 'GA',
          appliesToWorkloads: ['saas-embedded', 'shadow'],
        },
        {
          tool: 'Microsoft Entra Internet Access (SWG) egress policy',
          action: 'Allow / warn / block the SaaS app\u2019s AI endpoints by user group via Conditional Access.',
          status: 'GA',
          appliesToWorkloads: ['shadow'],
        },
        {
          tool: 'Microsoft Entra SSO + SCIM provisioning',
          action: 'Provision and de-provision SaaS app users (including their AI-feature entitlements) from Entra so leavers lose AI access automatically.',
          status: 'GA',
          appliesToWorkloads: ['saas-embedded', 'govern'],
        },
      ],
      dataProtection: [
        {
          tool: 'Microsoft Purview "Other AI apps" \u2014 DSPM, classification, DLP',
          action: 'Detect and (where supported) block sensitive submissions to the SaaS app\u2019s AI features.',
          status: 'GA',
          caveat: 'Edge-only for some flows. Coverage applies only when the SaaS AI app is on the Microsoft Purview supported-sites list \u2014 verify per vendor. Comm Compliance, eDiscovery, and retention for prompts are restricted to ChatGPT, Microsoft Chat (consumer version), Google Gemini, and DeepSeek \u2014 most generic SaaS AI apps are not covered.',
          appliesToWorkloads: ['saas-embedded'],
        },
        {
          tool: 'Microsoft Purview Endpoint DLP',
          action: 'Block sensitive copy/paste and file upload from managed endpoints into the SaaS app\u2019s web or desktop client.',
          status: 'GA',
          appliesToWorkloads: ['saas-embedded', 'shadow'],
        },
      ],
      monitorRespond: [
        {
          tool: 'Microsoft Defender for Cloud Apps anomaly detection',
          action: 'Alert on anomalous SaaS app usage (volume spikes, off-hours, impossible travel); promote to Defender XDR incidents.',
          status: 'GA',
          appliesToWorkloads: ['saas-embedded', 'shadow'],
        },
        {
          tool: 'Microsoft Purview Insider Risk Management \u2014 Risky AI usage',
          action: 'Use SaaS-AI signals (when surfaced via the Purview browser extension on Edge) as inputs to Risky AI usage policies.',
          status: 'GA',
          caveat: 'Coverage limited to Edge browser sessions.',
          appliesToWorkloads: ['saas-embedded'],
        },
      ],
      govern: [
        {
          tool: 'Microsoft Purview Compliance Manager',
          action: 'Track SaaS AI control coverage against AI regulation templates (NIST AI RMF, ISO/IEC 42001, EU AI Act) as part of the tenant compliance program.',
          status: 'GA',
          appliesToWorkloads: ['govern'],
        },
        {
          tool: 'Microsoft Purview Data Lifecycle Management',
          action: 'Apply retention to SaaS AI interactions where the vendor surfaces them to Microsoft Purview.',
          status: 'GA',
          caveat: 'Retention support for SaaS AI app prompts is limited \u2014 verify per app.',
          appliesToWorkloads: ['govern'],
        },
      ],
    },
    gaps: [
      {
        gap: 'No Microsoft Purview sensitivity-label enforcement or encryption-on-labels for these SaaS AI surfaces.',
        compensatingControl: 'process',
        suggestion: 'Layer GSA + Conditional Access + Endpoint DLP; document the gap and review with Insider Risk Management after the fact.',
        layer: 'data',
        appliesToWorkloads: ['saas-embedded'],
      },
      {
        gap: '"Other AI apps" Edge-only restrictions \u2014 non-Edge browsers and native desktop SaaS clients are not in scope of the Purview browser extension.',
        compensatingControl: 'process',
        suggestion: 'Restrict sanctioned SaaS AI use to Edge sessions via Conditional Access; treat native desktop clients as exceptions requiring review.',
        layer: 'endpoint',
        appliesToWorkloads: ['saas-embedded', 'shadow'],
      },
      {
        gap: 'Communication Compliance, eDiscovery, and retention for prompts are restricted to ChatGPT, Microsoft Chat (consumer version), Google Gemini, and DeepSeek \u2014 most SaaS AI apps are not covered.',
        compensatingControl: 'process',
        suggestion: 'Use the vendor admin console audit export plus Sentinel ingestion for these SaaS apps; document the limitation in the AI governance program.',
        layer: 'govern',
        appliesToWorkloads: ['govern', 'saas-embedded'],
      },
      {
        gap: 'Vendor admin surface varies \u2014 feature granularity, audit fidelity, and "AI off" toggle behavior differ per SaaS app.',
        compensatingControl: 'process',
        suggestion: 'Maintain a per-vendor configuration baseline and review during procurement and quarterly attestations.',
        layer: 'govern',
        appliesToWorkloads: ['govern', 'saas-embedded', 'shadow'],
      },
    ],
    sourceIds: ['gsa-shadow-ai', 'purview-other-ai-apps', 'purview-supported-sites', 'dfca-shadow-ai', 'purview-ai'],
  },
]
