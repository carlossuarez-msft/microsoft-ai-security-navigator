# Source validation

## Preferred source order

1. Microsoft Learn / official Microsoft documentation
2. Official Microsoft product blogs or announcements
3. Official framework sources such as NIST, OWASP, MITRE, CSA, CIS, ISO, CISA, and ENISA
4. Product UI validation notes

## Current important sources

- Microsoft Entra Global Secure Access overview
- Global Secure Access web content filtering category reference
- Global Secure Access Shadow AI discovery
- Security for AI in Microsoft Defender portal
- Microsoft Defender for AI Services (formerly threat protection for AI workloads)
- Microsoft Agent 365 overview and Frontier program
- Microsoft Purview AI data security guidance (overall, ChatGPT Enterprise, Other AI apps)
- Audit logs for Copilot and AI applications (pay-as-you-go billing for non-Microsoft AI)
- NIST AI RMF
- OWASP LLM Top 10
- MITRE ATLAS

## Validation backlog

- Validate current Global Secure Access URL filtering limits before recommending a URL-list-heavy approach.
- Validate Defender for Cloud Apps AI/GenAI category names in the product UI.
- Re-check `learn.microsoft.com/purview/ai-microsoft-purview-supported-sites` periodically to see whether Claude.ai is added to the supported retention list.
- Confirm the current list of pre-integrated Agent 365 third-party partner agents (`learn.microsoft.com/microsoft-agent-365/third-party-agents`).
- Confirm Defender for AI Services Azure Government and AWS coverage at next quarterly re-validation.
- Validate OpenAI ChatGPT Enterprise vendor-side controls (SSO, BYOK, residency, audit) against the OpenAI Enterprise Privacy and OpenAI Security Portal pages before customer-facing publish.
- Validate Anthropic Claude controls (SSO, training data, audit, residency) against the Anthropic Trust Center before customer-facing publish.
