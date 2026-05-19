import { useEffect, useMemo, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Wizard, type WizardStep } from './components/Wizard'
import { ScenarioPlaybook } from './components/ScenarioPlaybook'
import { ProductRoleMap } from './components/ProductRoleMap'
import { OperatingModel } from './components/OperatingModel'
import { FrameworkAlignment } from './components/FrameworkAlignment'
import { scenarios } from './data/scenarios'
import { platforms } from './data/platforms'
import { useCases } from './data/useCases'
import { workloads, workloadById } from './data/workloads'
import { productFamilies } from './data/products'
import { operatingModel } from './data/operatingModel'
import { frameworks } from './data/frameworks'
import './styles/theme.css'
import './styles/app.css'

/**
 * Date this site's content was last reviewed against Microsoft Learn and vendor
 * trust centers. Update on every substantive data refresh.
 */
export const LAST_REVIEWED = '2025-11-14'

function App() {
  // Lazy-initialize from URL hash so deep links (#w=…&p=…&step=N) work on first
  // render without triggering a cascading re-render from inside an effect.
  // Also accepts the legacy #uc=…&p=…&step=N form for backward compatibility:
  // the use case is mapped to its parent workload and the hash is rewritten.
  const initialHashState = (() => {
    if (typeof window === 'undefined') {
      return { step: 1 as WizardStep, workloadId: null as string | null, platformId: null as string | null }
    }
    const raw = window.location.hash.replace(/^#/, '')
    if (!raw) return { step: 1 as WizardStep, workloadId: null, platformId: null }
    const params = new URLSearchParams(raw)
    let wParam = params.get('w')
    const ucParam = params.get('uc')
    if (!wParam && ucParam) {
      const uc = useCases.find((u) => u.id === ucParam)
      if (uc) wParam = uc.workloadCategory
    }
    const p = params.get('p')
    const s = Number(params.get('step'))
    const matchedW = wParam && workloadById[wParam] ? wParam : null
    const matchedP = p && platforms.some((pl) => pl.id === p) ? p : null
    let resolvedStep: WizardStep = 1
    if (s === 3 && matchedW && matchedP) resolvedStep = 3
    else if (s === 2 && matchedW) resolvedStep = 2
    else if (s === 1) resolvedStep = 1
    return { step: resolvedStep, workloadId: matchedW, platformId: matchedP }
  })()

  const [step, setStep] = useState<WizardStep>(initialHashState.step)
  const [selectedWorkloadId, setSelectedWorkloadId] = useState<string | null>(initialHashState.workloadId)
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(initialHashState.platformId)
  const hydratedRef = useRef(true)

  // Sync state -> URL hash (canonical #w=…&p=…&step=N) whenever it changes.
  useEffect(() => {
    if (!hydratedRef.current) return
    const params = new URLSearchParams()
    if (selectedWorkloadId) params.set('w', selectedWorkloadId)
    if (selectedPlatformId) params.set('p', selectedPlatformId)
    params.set('step', String(step))
    const next = `#${params.toString()}`
    if (next !== window.location.hash) {
      window.history.replaceState(null, '', next)
    }
  }, [step, selectedWorkloadId, selectedPlatformId])

  const selectedWorkload = useMemo(
    () => (selectedWorkloadId ? workloadById[selectedWorkloadId] ?? null : null),
    [selectedWorkloadId],
  )
  const selectedPlatform = useMemo(
    () => platforms.find((p) => p.id === selectedPlatformId) ?? null,
    [selectedPlatformId],
  )

  const handleSelectWorkload = (id: string) => {
    setSelectedWorkloadId(id)
    // If the previously chosen platform is no longer applicable to the new workload, clear it.
    const wl = workloadById[id]
    if (wl && selectedPlatform && !selectedPlatform.applicableWorkloads.includes(wl.id)) {
      setSelectedPlatformId(null)
    }
    setStep(2)
  }

  const handleSelectPlatform = (id: string) => {
    setSelectedPlatformId(id)
    setStep(3)
  }

  const handleStartOver = () => {
    setSelectedWorkloadId(null)
    setSelectedPlatformId(null)
    setStep(1)
  }

  const handleGoToStep = (target: WizardStep) => {
    setStep(target)
  }

  const handleStart = () => {
    setStep(1)
  }

  // Pick a related scenario for the deeper "Learn more" disclosure on Step 3.
  // Heuristic: by selected platform id (preferred), else by workload, else fall back.
  const relatedScenario = useMemo(() => {
    if (selectedPlatform) {
      const byPlatform = scenarios.find((s) => s.id === selectedPlatform.id)
      if (byPlatform) return byPlatform
    }
    if (selectedWorkload) {
      const wl = selectedWorkload.id
      if (wl === 'agents') return scenarios.find((s) => s.id === 'agent-governance') ?? scenarios[0]
      if (wl === 'shadow' || wl === 'chat')
        return scenarios.find((s) => s.id === 'public-ai-tools') ?? scenarios[0]
      if (wl === 'apps' || wl === 'infra' || wl === 'data')
        return scenarios.find((s) => s.id === 'azure-ai-apps') ?? scenarios[0]
    }
    return scenarios[0]
  }, [selectedPlatform, selectedWorkload])

  const learnMore = (
    <>
      <ScenarioPlaybook scenario={relatedScenario} scenarios={scenarios} />
      <ProductRoleMap productFamilies={productFamilies} scenarios={scenarios} />
      <OperatingModel items={operatingModel} />
    </>
  )

  return (
    <AppShell onStart={handleStart} lastReviewed={LAST_REVIEWED}>
      <Wizard
        workloads={workloads}
        platforms={platforms}
        step={step}
        selectedWorkload={selectedWorkload}
        selectedPlatform={selectedPlatform}
        onSelectWorkload={handleSelectWorkload}
        onSelectPlatform={handleSelectPlatform}
        onGoToStep={handleGoToStep}
        onStartOver={handleStartOver}
        learnMore={learnMore}
      />

      <FrameworkAlignment frameworks={frameworks} />

      <section className="section" id="about">
        <div className="section-heading">
          <div>
            <p className="eyebrow">About this navigator</p>
            <h2>Secure your GenAI workloads, layer by layer.</h2>
            <p>
              The Microsoft AI Security Navigator takes you from &ldquo;what are we trying to
              protect?&rdquo; to a Microsoft-grounded defense-in-depth plan in three steps. Pick the
              AI workload, pick the platform you&apos;re running on, and see the layered Microsoft
              controls &mdash; plus where you&apos;ll need a compensating control. Microsoft control
              claims are validated against Microsoft Learn. Capabilities for non-Microsoft platforms
              (OpenAI, Anthropic, and others) are summarized from public documentation and should be
              verified against the vendor trust center before you rely on them.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

export default App
