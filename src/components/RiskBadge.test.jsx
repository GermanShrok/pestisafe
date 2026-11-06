import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RiskBadge from './RiskBadge'
import { RiskLevel } from '../lib/riskAssessment'

describe('RiskBadge', () => {
  it('renders the green copy and css class for GREEN', () => {
    render(<RiskBadge level={RiskLevel.GREEN} />)
    const badge = screen.getByTestId('risk-badge')
    expect(badge).toHaveClass('risk-badge--green')
    expect(screen.getByText(/Green — Lower risk/)).toBeInTheDocument()
  })

  it('renders the yellow copy and css class for YELLOW', () => {
    render(<RiskBadge level={RiskLevel.YELLOW} />)
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--yellow')
    expect(screen.getByText(/Yellow — Caution/)).toBeInTheDocument()
  })

  it('renders the red copy and css class for RED', () => {
    render(<RiskBadge level={RiskLevel.RED} />)
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--red')
    expect(screen.getByText(/Red — High risk/)).toBeInTheDocument()
  })

  it('renders nothing for an unrecognized level', () => {
    const { container } = render(<RiskBadge level="purple" />)
    expect(container).toBeEmptyDOMElement()
  })
})
