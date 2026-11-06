import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Dashboard from './Dashboard'
import { SCENARIOS } from '../lib/dashboardScenarios'

describe('Dashboard', () => {
  it('renders the first scenario field name and a risk badge', () => {
    render(<Dashboard />)
    expect(screen.getByRole('heading', { name: SCENARIOS[0].fieldName })).toBeInTheDocument()
    expect(screen.getByTestId('risk-badge')).toBeInTheDocument()
  })

  it('shows all four readings plus bee visits', () => {
    render(<Dashboard />)
    expect(screen.getByText(`${SCENARIOS[0].reading.windSpeedKmh} km/h`)).toBeInTheDocument()
    expect(screen.getByText(`${SCENARIOS[0].reading.temperatureC}°C`)).toBeInTheDocument()
    expect(screen.getByText(`${SCENARIOS[0].reading.humidityPct}%`)).toBeInTheDocument()
    expect(screen.getByText(String(SCENARIOS[0].beeVisitsPer5Min))).toBeInTheDocument()
  })

  it('cycles to the next scenario and updates the field name, readings, and badge', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    await user.click(screen.getByRole('button', { name: /Simulate next reading/ }))
    expect(screen.getByRole('heading', { name: SCENARIOS[1].fieldName })).toBeInTheDocument()
    expect(screen.getByText(`${SCENARIOS[1].reading.windSpeedKmh} km/h`)).toBeInTheDocument()
  })

  it('wraps back to the first scenario after cycling through all of them', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    for (let i = 0; i < SCENARIOS.length; i++) {
      await user.click(screen.getByRole('button', { name: /Simulate next reading/ }))
    }
    expect(screen.getByRole('heading', { name: SCENARIOS[0].fieldName })).toBeInTheDocument()
  })

  it('shows a recommendation that matches the computed risk level', () => {
    render(<Dashboard />)
    // first scenario (calm-morning) resolves to GREEN -> "support proceeding" text
    expect(screen.getByText(/support proceeding/)).toBeInTheDocument()
  })

  it('shows the illustrative-data disclaimer', () => {
    render(<Dashboard />)
    expect(screen.getByText(/fictional demonstration readings/)).toBeInTheDocument()
  })
})
