import type { OperatingModelItem } from '../types/content'

export const operatingModel: OperatingModelItem[] = [
  {
    id: 'identify',
    title: 'Identify the AI usage',
    leadershipQuestion: 'Where is AI already being used?',
    description: 'Start from Copilot rollout, public AI tools, business agents, custom AI apps, or SOC incidents.',
    primaryProducts: ['Defender for Cloud Apps', 'Purview DSPM', 'Agent 365', 'Microsoft 365 admin reports'],
  },
  {
    id: 'control-access',
    title: 'Control access',
    leadershipQuestion: 'Who can use AI and from where?',
    description: 'Use identity, Conditional Access, device posture, Global Secure Access, and tenant restrictions.',
    primaryProducts: ['Microsoft Entra', 'Global Secure Access', 'Intune'],
  },
  {
    id: 'protect-data',
    title: 'Protect data',
    leadershipQuestion: 'What data can AI reach or disclose?',
    description: 'Use sensitivity labels, DLP, audit, DSPM for AI, eDiscovery, and retention.',
    primaryProducts: ['Microsoft Purview', 'Endpoint DLP', 'SharePoint Advanced Management'],
  },
  {
    id: 'govern-agents',
    title: 'Govern apps and agents',
    leadershipQuestion: 'Who owns agents and what can they do?',
    description: 'Track inventory, ownership, permissions, tool use, publishing, and shutdown paths.',
    primaryProducts: ['Agent 365', 'Copilot Studio', 'Entra Agent ID', 'Security for AI'],
  },
  {
    id: 'detect-respond',
    title: 'Detect and respond',
    leadershipQuestion: 'How does the SOC respond to AI incidents?',
    description: 'Correlate AI workload, identity, endpoint, app, and data signals into investigation workflows.',
    primaryProducts: ['Defender XDR', 'Microsoft Sentinel', 'Security Copilot', 'Defender for Cloud'],
  },
]
