import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import RiskSimulator from './RiskSimulator'

describe('RiskSimulator', () => {
  it('renders a GREEN result with the default inputs (canola / insecticide / low pollinator activity, not blooming)', () => {
    render(<RiskSimulator />)
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--green')
  })

  it('escalates to RED when wind speed is dragged to a high-risk value', () => {
    render(<RiskSimulator />)
    fireEvent.change(screen.getByLabelText(/Wind speed/), { target: { value: '20' } })
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--red')
    expect(screen.getByText(/Wind speed 20 km\/h/)).toBeInTheDocument()
  })

  it('escalates to YELLOW when temperature crosses the caution threshold', () => {
    render(<RiskSimulator />)
    fireEvent.change(screen.getByLabelText(/Temperature/), { target: { value: '28' } })
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--yellow')
  })

  it('escalates to RED when pollinator activity is set to High', async () => {
    const user = userEvent.setup()
    render(<RiskSimulator />)
    await user.selectOptions(screen.getByLabelText(/Pollinator activity/), 'high')
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--red')
  })

  it('escalates to RED when crop blooming is checked (canola is highly attractive, insecticide is high toxicity)', async () => {
    const user = userEvent.setup()
    render(<RiskSimulator />)
    await user.click(screen.getByLabelText(/Crop is currently blooming/))
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--red')
  })

  it('switching crop to wheat (low attractiveness) keeps bloom + low pollinator activity at GREEN', async () => {
    const user = userEvent.setup()
    render(<RiskSimulator />)
    await user.selectOptions(screen.getByLabelText(/Crop type/), 'wheat')
    await user.click(screen.getByLabelText(/Crop is currently blooming/))
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--green')
  })

  it('switching pesticide type to herbicide caps high pollinator activity at YELLOW instead of RED', async () => {
    const user = userEvent.setup()
    render(<RiskSimulator />)
    await user.selectOptions(screen.getByLabelText(/Pesticide type/), 'herbicide')
    await user.selectOptions(screen.getByLabelText(/Pollinator activity/), 'high')
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--yellow')
  })

  it('reset button restores the default reading', async () => {
    const user = userEvent.setup()
    render(<RiskSimulator />)
    fireEvent.change(screen.getByLabelText(/Wind speed/), { target: { value: '35' } })
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--red')

    await user.click(screen.getByRole('button', { name: /Reset simulation/ }))
    expect(screen.getByLabelText(/Wind speed/)).toHaveValue('8')
    expect(screen.getByTestId('risk-badge')).toHaveClass('risk-badge--green')
  })

  it('always shows the educational-demo disclaimer', () => {
    render(<RiskSimulator />)
    expect(screen.getByText(/not a validated spray-risk calculator/)).toBeInTheDocument()
  })

  it('lists triggered factors as reasons', () => {
    render(<RiskSimulator />)
    expect(screen.getByRole('heading', { name: /Triggered factors/ })).toBeInTheDocument()
  })
})
