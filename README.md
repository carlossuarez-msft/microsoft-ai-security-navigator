# Microsoft AI Security Navigator

Customer-facing React site for explaining how to secure AI adoption with the Microsoft security stack.

## Open locally

Do not double-click `index.html`. This is a Vite React app, so `index.html` must be served by a local web server.

Use either option:

```powershell
.\open-local.cmd
```

or:

```powershell
npm run open
```

The launcher builds the app, starts a production preview server, and opens:

```text
http://127.0.0.1:5173
```

## Purpose

This project helps CISOs, CIOs, security architects, compliance leaders, AI governance teams, and IT admins understand where AI security risk appears and which Microsoft control planes apply.

The site is scenario-first. It starts with customer situations such as:

- Microsoft 365 Copilot rollout
- Public AI tool usage
- AI agent governance
- Azure AI Foundry / custom AI apps

Then it maps those scenarios to Microsoft controls across Entra, Global Secure Access, Purview, Defender, Intune, Agent 365, Security for AI, Sentinel, and Security Copilot.

## Local development

```powershell
npm install
npm run dev
```

Use `npm run dev` only for development. For a stable preview, use `npm run open`.

## Build

```powershell
npm run build
```

## GitHub Pages build

For repository-based GitHub Pages hosting, set the Vite base path:

```powershell
$env:VITE_BASE_PATH="/microsoft-ai-security-navigator/"
npm run build
```

## Repository workflow

- Local development path: `C:\repos\microsoft-ai-security-navigator`
- Private working repo owner: `carlossuarez_microsoft`
- Future GitHub Pages publishing owner/org: `carlossuarez_msft`
- Visibility while drafting: private

Recommended workflow:

1. Develop privately under `carlossuarez_microsoft`.
2. Validate content, citations, preview labels, and customer-facing messaging.
3. Publish or mirror a release-ready version to `carlossuarez_msft` for GitHub Pages.

## Content structure

Content lives in typed data modules:

- `src\data\scenarios.ts`
- `src\data\products.ts`
- `src\data\operatingModel.ts`
- `src\data\frameworks.ts`
- `src\data\sources.ts`

UI components live in:

- `src\components`

Styling lives in:

- `src\styles\theme.css`
- `src\styles\app.css`

The earlier standalone prototype is archived in:

- `prototypes\ai-security-governance-lifecycle.html`

## Content governance

Preview, licensing, and tenant-specific behavior must be clearly labeled. Do not imply that one Microsoft product secures every AI scenario.

Key distinction:

- Public AI tool governance uses Global Secure Access, Defender for Cloud Apps, Purview DLP, Endpoint DLP, and Conditional Access.
- Internal Azure AI workload protection uses Azure AI Foundry, Defender for Cloud, Azure AI Content Safety, managed identity, and Key Vault.
- Agent lifecycle governance uses Agent 365, Entra Agent ID, Security for AI, Purview Audit, Defender XDR, Sentinel, and Security Copilot.
