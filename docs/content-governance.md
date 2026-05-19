# Content governance

## Principles

1. Start from the customer scenario, not the product catalog.
2. Separate confirmed GA capabilities from preview or licensing-dependent capabilities.
3. Cite Microsoft Learn or official Microsoft documentation for product capabilities.
4. Cite independent frameworks separately from Microsoft product documentation.
5. Use plain language for customer-facing copy.

## Required labels

Use status labels consistently:

- `GA`
- `Preview`
- `Validate`

## Caveat rules

Add caveats when:

- a capability is in preview,
- licensing is new or changing,
- the capability is tenant-configurable,
- exact product scope needs customer validation,
- a control applies only to Azure-hosted AI workloads and not public AI websites.

## Current caveats to preserve

- Global Secure Access includes an Artificial Intelligence web content filtering category, but exact FQDN coverage should be tenant-tested.
- Universal Tenant Restrictions applies to Entra-integrated apps; direct public AI websites still need web/category/FQDN controls.
- Security for AI agent inventory/posture has preview and Agent 365 licensing caveats.
- Defender for AI Services (formerly "threat protection for AI workloads") applies to supported Azure-hosted AI workloads (Azure OpenAI, Azure AI Model Inference; text tokens only; commercial clouds only), not public AI browser usage. Threat protection for Foundry-built AI agents is in public preview.
- Universal Tenant Restrictions applies only to Entra-integrated tenants/apps. It does not block public AI sites (Claude.ai, ChatGPT consumer, Gemini, DeepSeek); use Global Secure Access web content filtering and Shadow AI discovery for those.
- Microsoft Agent 365 is GA (May 1, 2026) and licensed per user; Frontier preview features (Shadow AI for agents, agents with their own identity) must be labeled as preview.
- Microsoft Purview AI coverage differs by surface: Copilot has labels/encryption/DLP/retention; ChatGPT Enterprise does not support labels/encryption/DLP; Other AI apps support DLP via browser/network but not labels/encryption, and retention is restricted to a named list of apps that does not include Claude.
