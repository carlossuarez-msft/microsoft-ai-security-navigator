import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Layer, Platform, PlatformKind, Workload } from '../types/content'
import {
  getLayeredCoverageForWorkload,
  getPrimaryLayersForWorkload,
  layerLabel,
  layerSubtitle,
} from '../data/coverageMatrix'
import { platformsForWorkload, workloadStep2Heading } from '../data/workloads'
import { StatusPill } from './StatusPill'
import { SourceBadge } from './SourceBadge'

// Mirrored from App.tsx LAST_REVIEWED; defined here to avoid a circular import.
const LAST_REVIEWED = '2025-11-14'

export type WizardStep = 1 | 2 | 3

interface WizardProps {
  workloads: Workload[]
  platforms: Platform[]
  step: WizardStep
  selectedWorkload: Workload | null
  selectedPlatform: Platform | null
  onSelectWorkload: (id: string) => void
  onSelectPlatform: (id: string) => void
  onGoToStep: (step: WizardStep) => void
  onStartOver: () => void
  /** Rendered inside Step 3 below the answer card as a "Learn more" disclosure. */
  learnMore?: React.ReactNode
}

const kindOrder: PlatformKind[] = ['microsoft', 'openai', 'anthropic', 'custom', 'saas']

const kindLabel: Record<PlatformKind, string> = {
  microsoft: 'Microsoft',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  aws: 'AWS',
  google: 'Google Cloud',
  custom: 'Custom on Azure',
  saas: 'SaaS apps with embedded AI',
}

const coverageLabel: Record<Platform['microsoftCoverage'], string> = {
  High: 'High Microsoft coverage',
  Medium: 'Partial Microsoft coverage',
  Low: 'Limited Microsoft coverage',
}

export function Wizard(props: WizardProps) {
  const {
    workloads,
    platforms,
    step,
    selectedWorkload,
    selectedPlatform,
    onSelectWorkload,
    onSelectPlatform,
    onGoToStep,
    onStartOver,
    learnMore,
  } = props

  const topRef = useRef<HTMLDivElement | null>(null)
  const pageHeadingRef = useRef<HTMLHeadingElement | null>(null)
  const firstStepEffectRef = useRef(true)

  useEffect(() => {
    if (firstStepEffectRef.current) {
      // Skip auto-scroll/focus on first mount so URL-hydrated deep links don't jump.
      firstStepEffectRef.current = false
      return
    }
    if (!topRef.current) return
    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    topRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    // Move focus to the new page heading for keyboard / SR users after step change.
    const id = window.setTimeout(() => pageHeadingRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [step])

  const platformsForStep2 = useMemo(() => {
    if (!selectedWorkload) return []
    // Authoritative: filter platforms by the workload×platform allow-list, not
    // by the legacy PlatformKind union (which was over-permissive).
    return platformsForWorkload(selectedWorkload.id).filter((p) =>
      platforms.some((pp) => pp.id === p.id),
    )
  }, [platforms, selectedWorkload])

  const platformsByKind = useMemo(() => {
    const map = new Map<PlatformKind, Platform[]>()
    kindOrder.forEach((k) => map.set(k, []))
    platformsForStep2.forEach((p) => map.get(p.kind)?.push(p))
    return map
  }, [platformsForStep2])

  return (
    <section className="wiz" id="start" aria-label="Microsoft AI Security Navigator">
      <div ref={topRef} aria-hidden="true" />
      <StepProgress
        step={step}
        selectedWorkload={selectedWorkload}
        selectedPlatform={selectedPlatform}
        onGoToStep={onGoToStep}
      />

      <div className="wiz__viewport">
        {step === 1 && (
          <Step1
            workloads={workloads}
            selectedWorkload={selectedWorkload}
            onSelectWorkload={onSelectWorkload}
            pageHeadingRef={pageHeadingRef}
          />
        )}
        {step === 2 && selectedWorkload && (
          <Step2
            workload={selectedWorkload}
            platformsByKind={platformsByKind}
            selectedPlatform={selectedPlatform}
            onSelectPlatform={onSelectPlatform}
            onBack={() => onGoToStep(1)}
            pageHeadingRef={pageHeadingRef}
          />
        )}
        {step === 3 && selectedWorkload && selectedPlatform && (
          <Step3
            workload={selectedWorkload}
            platform={selectedPlatform}
            onBack={() => onGoToStep(2)}
            onStartOver={onStartOver}
            onEditWorkload={() => onGoToStep(1)}
            onEditPlatform={() => onGoToStep(2)}
            learnMore={learnMore}
            pageHeadingRef={pageHeadingRef}
          />
        )}
      </div>
    </section>
  )
}

/* ---------- Step progress (3 numbered circles connected by a line) ---------- */

interface StepProgressProps {
  step: WizardStep
  selectedWorkload: Workload | null
  selectedPlatform: Platform | null
  onGoToStep: (step: WizardStep) => void
}

const stepTitles: Record<WizardStep, string> = {
  1: 'Pick the AI workload',
  2: 'Choose the platform',
  3: 'Defense-in-depth plan',
}

function StepProgress({ step, selectedWorkload, selectedPlatform, onGoToStep }: StepProgressProps) {
  const items: Array<{ index: WizardStep; label: string; value: string; enabled: boolean }> = [
    { index: 1, label: 'Workload', value: selectedWorkload?.title ?? '-', enabled: true },
    { index: 2, label: 'Platform', value: selectedPlatform?.name ?? '-', enabled: !!selectedWorkload },
    {
      index: 3,
      label: 'Defense in depth',
      value: selectedPlatform ? 'Layered plan' : '-',
      enabled: !!selectedWorkload && !!selectedPlatform,
    },
  ]

  return (
    <nav className="step-progress" aria-label="Wizard progress">
      <p className="step-progress__title">
        Step {step} of 3 - <span>{stepTitles[step]}</span>
      </p>
      <ol className="step-progress__list">
        {items.map((item, i) => {
          const isCurrent = item.index === step
          const isDone = item.index < step
          const state = isCurrent ? 'current' : isDone ? 'done' : 'future'
          return (
            <li key={item.index} className={`step-progress__item is-${state}`}>
              {i > 0 ? <span className="step-progress__rail" aria-hidden="true" /> : null}
              <button
                type="button"
                className="step-progress__dot"
                aria-current={isCurrent ? 'step' : undefined}
                disabled={!isDone}
                onClick={() => isDone && onGoToStep(item.index)}
                title={isDone ? `Back to ${item.label}` : item.label}
              >
                {isDone ? (
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path
                      d="M3.5 8.5l3 3 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{item.index}</span>
                )}
              </button>
              <span className="step-progress__meta">
                <span className="step-progress__label">{item.label}</span>
                <span className="step-progress__value">{item.value}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ---------- Step 1 ---------- */

interface Step1Props {
  workloads: Workload[]
  selectedWorkload: Workload | null
  onSelectWorkload: (id: string) => void
  pageHeadingRef: React.RefObject<HTMLHeadingElement | null>
}

function Step1({ workloads, selectedWorkload, onSelectWorkload, pageHeadingRef }: Step1Props) {
  return (
    <div className="wiz-page wiz-page--enter" key="step-1">
      <header className="wiz-page__head">
        <p className="eyebrow">Step 1 of 3</p>
        <h1 ref={pageHeadingRef} tabIndex={-1}>What AI workload are you trying to protect?</h1>
        <p className="lede">
          Pick the AI workload you&apos;re protecting. Each tile is one shape of AI &mdash; chat
          assistants, agents, custom apps, coding tools, embedded SaaS AI, infrastructure, the data
          feeding the models, and so on. Next you&apos;ll pick the platform you&apos;re on, and
          we&apos;ll show the defense-in-depth plan.
        </p>
      </header>

      <div className="wiz-tile-grid">
        {workloads.map((wl) => {
          const active = wl.id === selectedWorkload?.id
          const covers = wl.coversConcerns.slice(0, 4).join(' · ')
          return (
            <button
              key={wl.id}
              type="button"
              aria-current={active ? 'true' : undefined}
              className={`wiz-tile${active ? ' is-active' : ''}`}
              onClick={() => onSelectWorkload(wl.id)}
            >
              <strong>{wl.title}</strong>
              <span className="wiz-tile__hint">{wl.summary}</span>
              {covers ? <span className="wiz-tile__covers">Covers: {covers}</span> : null}
              <span className="wiz-tile__cta" aria-hidden="true">
                Choose &rarr;
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Step 2 ---------- */

interface Step2Props {
  workload: Workload
  platformsByKind: Map<PlatformKind, Platform[]>
  selectedPlatform: Platform | null
  onSelectPlatform: (id: string) => void
  onBack: () => void
  pageHeadingRef: React.RefObject<HTMLHeadingElement | null>
}

function Step2({ workload, platformsByKind, selectedPlatform, onSelectPlatform, onBack, pageHeadingRef }: Step2Props) {
  const anyPlatforms = Array.from(platformsByKind.values()).some((arr) => arr.length > 0)
  const heading = workloadStep2Heading[workload.id]

  return (
    <div className="wiz-page wiz-page--enter" key="step-2">
      <header className="wiz-page__head">
        <p className="eyebrow">Step 2 of 3</p>
        <h1 ref={pageHeadingRef} tabIndex={-1}>{heading}</h1>
        <p className="lede">
          For <strong>{workload.title}</strong>, these are the relevant platforms. Grouped by
          vendor. Coverage label shows how much native Microsoft tooling reaches the platform
          today.
        </p>
        <div className="wiz-page__actions">
          <button type="button" className="button" onClick={onBack}>
            &larr; Back to workloads
          </button>
        </div>
      </header>

      {!anyPlatforms && (
        <div className="wiz-empty card">
          <p>No tracked platforms for this workload yet.</p>
        </div>
      )}

      {kindOrder.map((kind) => {
        const group = platformsByKind.get(kind) ?? []
        if (group.length === 0) return null
        return (
          <section className="wiz-group" key={kind} aria-labelledby={`pgroup-${kind}`}>
            <h2 id={`pgroup-${kind}`} className="wiz-group__title">
              {kindLabel[kind]}
            </h2>
            <div className="wiz-tile-grid">
              {group.map((p) => {
                const active = p.id === selectedPlatform?.id
                const cov = p.microsoftCoverage.toLowerCase()
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    className={`wiz-tile wiz-tile--platform${active ? ' is-active' : ''}`}
                    onClick={() => onSelectPlatform(p.id)}
                  >
                    <strong>{p.name}</strong>
                    <span className="wiz-tile__hint">{p.summary}</span>
                    <span className={`pill pill--coverage-${cov} wiz-tile__pill`}>
                      {coverageLabel[p.microsoftCoverage]}
                    </span>
                    <span className="wiz-tile__cta" aria-hidden="true">
                      See the plan &rarr;
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* ---------- Step 3 ---------- */

interface Step3Props {
  workload: Workload
  platform: Platform
  onBack: () => void
  onStartOver: () => void
  onEditWorkload: () => void
  onEditPlatform: () => void
  learnMore?: React.ReactNode
  pageHeadingRef: React.RefObject<HTMLHeadingElement | null>
}

const WHY_DISMISSED_KEY = 'navigator.callout.why.dismissed'

function Step3({ workload, platform, onBack, onStartOver, onEditWorkload, onEditPlatform, learnMore, pageHeadingRef }: Step3Props) {
  const layered = useMemo(() => getLayeredCoverageForWorkload(workload, platform), [workload, platform])
  const primaryLayers = useMemo(() => new Set<Layer>(getPrimaryLayersForWorkload(workload)), [workload])
  const [whyOpen, setWhyOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      return window.localStorage.getItem(WHY_DISMISSED_KEY) !== '1'
    } catch {
      return true
    }
  })

  const dismissWhy = () => {
    setWhyOpen(false)
    try {
      window.localStorage.setItem(WHY_DISMISSED_KEY, '1')
    } catch {
      /* storage may be blocked; non-fatal */
    }
  }

  const stats = useMemo(() => {
    let toolCount = 0
    let fullLayers = 0
    let gapLayers = 0
    for (const sec of layered.layers) {
      toolCount += sec.tools.length
      if (sec.tools.length > 0 && sec.gaps.length === 0) fullLayers += 1
      if (sec.tools.length === 0 && sec.gaps.length > 0) gapLayers += 1
    }
    return { toolCount, fullLayers, gapLayers }
  }, [layered])

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')
  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    try {
      void navigator.clipboard?.writeText(url)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      /* clipboard may be blocked; non-fatal */
    }
  }

  const coverageTier: 'high' | 'medium' | 'low' = (() => {
    if (stats.gapLayers === 0 && stats.fullLayers >= 5) return 'high'
    if (stats.gapLayers >= 3) return 'low'
    return 'medium'
  })()

  const ledeIntro: ReactNode = (
    <>
      Here is the layered picture for <strong>{workload.title}</strong> on{' '}
      <span className="wiz-page__platform">{platform.name}</span>.
    </>
  )

  const ledeByTier: Record<'high' | 'medium' | 'low', ReactNode> = {
    high: (
      <>
        Microsoft tooling covers <strong>{stats.fullLayers}</strong> of 7 defense-in-depth layers.
        Validate licensing against Microsoft Learn, then operationalize the controls listed below per layer.
      </>
    ),
    medium: (
      <>
        Microsoft tooling addresses <strong>{stats.toolCount}</strong> controls across the seven layers, but{' '}
        <strong>{stats.gapLayers}</strong>{' '}
        {stats.gapLayers === 1 ? 'layer needs' : 'layers need'} a compensating control. Walk each layer and
        decide between a third-party tool, a documented process, or accepted risk.
      </>
    ),
    low: (
      <>
        Microsoft tooling only reaches part of the picture &mdash; <strong>{stats.gapLayers}</strong> of 7
        layers need a compensating control. Use this view to make the gaps explicit up front, before you
        commit to the platform.
      </>
    ),
  }

  return (
    <div className="wiz-page wiz-page--enter" key={`step-3-${workload.id}-${platform.id}`}>
      <header className="wiz-page__head">
        <p className="eyebrow">Step 3 of 3 &mdash; Defense in depth</p>
        <h1 ref={pageHeadingRef} tabIndex={-1}>Layered Microsoft security plan</h1>
        <p className="print-only print-header">
          Microsoft AI Security Navigator &mdash; {workload.title} on {platform.name}.
          Last reviewed {LAST_REVIEWED}.
        </p>
        <p className="lede">
          {ledeIntro} {ledeByTier[coverageTier]}
        </p>

        {workload.coversConcerns.length > 0 ? (
          <div className="step3-covers" aria-label="What this plan covers">
            <span className="step3-covers__label">This plan covers:</span>
            {workload.coversConcerns.map((c) => (
              <span className="pill pill--compact" key={c}>{c}</span>
            ))}
          </div>
        ) : null}

        <div className="step3-chips" role="group" aria-label="Selected workload and platform">
          <ContextChip label="Workload" value={workload.title} onEdit={onEditWorkload} editLabel="Change workload" />
          <ContextChip label="Platform" value={platform.name} onEdit={onEditPlatform} editLabel="Change platform" />
        </div>
      </header>

      <div className="step3-stats" role="group" aria-label="Coverage summary">
        <StatCard tone="brand" value={stats.toolCount} label={stats.toolCount === 1 ? 'Microsoft control listed' : 'Microsoft controls listed'} />
        <StatCard tone="success" value={`${stats.fullLayers} / 7`} label="Layers fully covered by Microsoft" />
        <StatCard tone={stats.gapLayers > 0 ? 'danger' : 'success'} value={stats.gapLayers} label={stats.gapLayers === 1 ? 'Layer needs a compensating control' : 'Layers need a compensating control'} />
      </div>

      {whyOpen ? (
        <div className="callout callout--info" role="note">
          <span className="callout__icon" aria-hidden="true">i</span>
          <p>
            <strong>Defense in depth.</strong> No single Microsoft control fully secures a GenAI workload.
            Identity, network, endpoint, data, application, detection, and governance each cover one slice &mdash; the honest plan is layered controls plus deliberate gap closure where Microsoft doesn&apos;t yet reach.
          </p>
          <button type="button" className="callout__dismiss" aria-label="Dismiss" onClick={dismissWhy}>&times;</button>
        </div>
      ) : null}

      <div className="layer-stack">
        {layered.layers.map((sec, i) => (
          <LayerCard
            key={sec.layer}
            index={i + 1}
            layer={sec.layer}
            tools={sec.tools}
            gaps={sec.gaps}
            platform={platform}
            isPrimary={primaryLayers.has(sec.layer)}
          />
        ))}
      </div>

      <section className="next-steps card" aria-labelledby="next-steps-heading">
        <h2 id="next-steps-heading">Suggested next steps</h2>
        <ol>
          <li>Validate the tools above against your tenant licensing and Microsoft Learn before committing.</li>
          <li>For each layer marked &ldquo;needs a compensating control,&rdquo; decide the compensating path &mdash; third-party tool, documented process, or accepted risk.</li>
          <li>Record the decision per layer in your security baseline so the gap is owned, not silently inherited.</li>
        </ol>
      </section>

      {platform.sourceIds && platform.sourceIds.length > 0 ? (
        <section className="sources" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="sources__heading">Sources</h2>
          <div className="sources__list">
            {platform.sourceIds.map((id) => (
              <SourceBadge key={id} sourceId={id} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="wiz-page__actions wiz-page__actions--foot">
        <button type="button" className="button" onClick={onBack}>&larr; Change platform</button>
        <button type="button" className="button" onClick={onStartOver}>&#8635; Start over</button>
        <button type="button" className="button" onClick={handleCopyLink} aria-live="polite">
          {copyState === 'copied' ? 'Link copied' : 'Copy link to this view'}
        </button>
        <button type="button" className="button button--primary" onClick={handlePrint}>
          Export as brief (Print)
        </button>
      </div>

      {learnMore ? (
        <details className="wiz-learn-more">
          <summary>Learn more &mdash; scenario playbook, product roles, operating model</summary>
          <div className="wiz-learn-more__body">{learnMore}</div>
        </details>
      ) : null}
    </div>
  )
}

interface ContextChipProps {
  label: string
  value: string
  editLabel: string
  onEdit: () => void
}

function ContextChip({ label, value, editLabel, onEdit }: ContextChipProps) {
  return (
    <div className="ctx-chip">
      <span className="ctx-chip__label">{label}</span>
      <span className="ctx-chip__value">{value}</span>
      <button type="button" className="ctx-chip__edit" onClick={onEdit} aria-label={editLabel}>
        Edit
      </button>
    </div>
  )
}

interface StatCardProps {
  value: React.ReactNode
  label: string
  tone: 'brand' | 'success' | 'danger' | 'warning'
}

function StatCard({ value, label, tone }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  )
}

interface LayerCardProps {
  index: number
  layer: Layer
  tools: import('../types/content').LayerSection['tools']
  gaps: import('../types/content').LayerSection['gaps']
  platform: Platform
  isPrimary: boolean
}

function LayerCard({ index, layer, tools, gaps, platform, isPrimary }: LayerCardProps) {
  const noMs = tools.length === 0
  const toolCount = tools.length
  const gapCount = gaps.length
  const total = Math.max(1, toolCount + gapCount)
  const greenPct = (toolCount / total) * 100
  const redPct = (gapCount / total) * 100

  return (
    <section className={`layer-card${noMs ? ' layer-card--empty' : ''}${isPrimary ? ' layer-card--primary' : ''}`} aria-labelledby={`layer-${layer}`}>
      <aside className="layer-card__rail">
        <span className="layer-card__num" aria-hidden="true">{index}</span>
        <div className="layer-card__rail-body">
          <h2 id={`layer-${layer}`} className="layer-card__title">{layerLabel[layer]}</h2>
          <p className="layer-card__sub">{layerSubtitle[layer]}</p>
          {isPrimary ? <span className="layer-card__pri">Primary focus</span> : null}
          <div className="layer-card__bar" aria-hidden="true">
            <span className="layer-card__bar-green" style={{ width: `${greenPct}%` }} />
            <span className="layer-card__bar-red" style={{ width: `${redPct}%` }} />
          </div>
          <p className="layer-card__bar-legend">
            <span className="dot dot--success" aria-hidden="true" /> {toolCount} tool{toolCount === 1 ? '' : 's'}
            <span className="layer-card__bar-sep">&middot;</span>
            <span className="dot dot--danger" aria-hidden="true" /> {gapCount} gap{gapCount === 1 ? '' : 's'}
          </p>
        </div>
      </aside>

      <div className="layer-card__body">
        {noMs && gaps.length === 0 ? (
          <div className="layer-card__none" role="note">
            <strong>No tracked Microsoft coverage and no tracked gap for this layer on {platform.name}.</strong>
            <p>This usually means the layer is not relevant to this platform, or coverage hasn&apos;t been verified yet. Validate against your tenant before assuming the layer is safe.</p>
          </div>
        ) : (
          <div className="layer-card__cols">
            <section className="layer-col">
              <h3 className="layer-col__head">
                <span className="dot dot--success" aria-hidden="true" /> Microsoft tools ({toolCount})
              </h3>
              {tools.length === 0 ? (
                <p className="layer-col__empty">
                  No Microsoft tool covers this layer for {platform.name}. See compensating controls &rarr;
                </p>
              ) : (
                <ul className="tool-list">
                  {tools.map((t, i) => (
                    <li key={`${t.microsoftTool}|${t.layer ?? ''}|${i}`} className="tool-row">
                      <div className="tool-row__main">
                        <strong className="tool-row__name">{t.microsoftTool}</strong>
                        <p className="tool-row__what">{t.whatItControls}</p>
                        {t.caveat ? <p className="tool-row__caveat"><em>Caveat:</em> {t.caveat}</p> : null}
                      </div>
                      <div className="tool-row__status">
                        {t.status ? <StatusPill status={t.status} gaDate={t.gaDate} /> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="layer-col">
              <h3 className="layer-col__head">
                <span className="dot dot--danger" aria-hidden="true" /> Gaps &amp; compensating controls ({gapCount})
              </h3>
              {gaps.length === 0 ? (
                <p className="layer-col__empty">No tracked gap for this layer on {platform.name}.</p>
              ) : (
                <ul className="gap-list">
                  {gaps.map((g, i) => (
                    <li key={`${g.gap}|${i}`} className="gap-row">
                      <span className="dot dot--danger gap-row__dot" aria-hidden="true" />
                      <div className="gap-row__main">
                        <p className="gap-row__text">{g.gap}</p>
                        <div className="gap-row__meta">
                          <span
                            className={`pill pill--compact ${g.compensatingControl === 'third-party' ? 'pill--danger' : 'pill--warning'}`}
                          >
                            {g.compensatingControl === 'third-party' ? 'Third-party tool' : 'Process'}
                          </span>
                          <span className="gap-row__suggestion">{g.suggestion}</span>
                        </div>
                        {g.compensatingVendors && g.compensatingVendors.length > 0 ? (
                          <div className="gap-row__vendors" aria-label="Example third-party vendors (alphabetical, not in priority order)">
                            <span className="gap-row__vendors-label">Example vendors:</span>
                            {g.compensatingVendors.map((v) => (
                              <span className="pill pill--compact pill--vendor" key={v}>{v}</span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </section>
  )
}
