import { RiskLevel } from '../lib/riskAssessment'

const COPY = {
  [RiskLevel.GREEN]: { label: 'Green — Lower risk', hint: 'Conditions suggest comparatively lower drift and pollinator exposure risk.' },
  [RiskLevel.YELLOW]: { label: 'Yellow — Caution', hint: 'Some conditions or pollinator activity may increase risk.' },
  [RiskLevel.RED]: { label: 'Red — High risk', hint: 'Elevated drift or pollinator exposure risk — spraying should be avoided or delayed.' },
}

export default function RiskBadge({ level }) {
  const copy = COPY[level]
  if (!copy) return null

  return (
    <div className={`risk-badge risk-badge--${level}`} role="status" data-testid="risk-badge">
      <span className="risk-badge__dot" aria-hidden="true" />
      <div>
        <p className="risk-badge__label">{copy.label}</p>
        <p className="risk-badge__hint">{copy.hint}</p>
      </div>
    </div>
  )
}
