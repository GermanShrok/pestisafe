import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import InsectScanner from './InsectScanner'

describe('InsectScanner', () => {
  it('renders a sample tile for every insect in the catalog', () => {
    render(<InsectScanner />)
    expect(screen.getByRole('button', { name: /Bumblebee/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Japanese beetle/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hoverfly/ })).toBeInTheDocument()
  })

  it('shows no result before clicking Identify', () => {
    render(<InsectScanner />)
    expect(screen.queryByTestId('scanner-result')).not.toBeInTheDocument()
  })

  it('identifies the default-selected sample (Bumblebee) as a Pollinator', async () => {
    const user = userEvent.setup()
    render(<InsectScanner />)
    await user.click(screen.getByRole('button', { name: /Identify insect/ }))
    const result = screen.getByTestId('scanner-result')
    expect(result).toHaveTextContent('Pollinator')
    expect(result).toHaveTextContent('Bumblebee')
  })

  it('selecting a pest sample and identifying shows the Pest tag', async () => {
    const user = userEvent.setup()
    render(<InsectScanner />)
    await user.click(screen.getByRole('button', { name: /Japanese beetle/ }))
    await user.click(screen.getByRole('button', { name: /Identify insect/ }))
    expect(screen.getByTestId('scanner-result')).toHaveTextContent('Pest')
  })

  it('selecting the both-roles sample shows the combined tag', async () => {
    const user = userEvent.setup()
    render(<InsectScanner />)
    await user.click(screen.getByRole('button', { name: /Hoverfly/ }))
    await user.click(screen.getByRole('button', { name: /Identify insect/ }))
    expect(screen.getByTestId('scanner-result')).toHaveTextContent('Both pollinator and pest')
  })

  it('low-confidence samples show a manual-review hint', async () => {
    const user = userEvent.setup()
    render(<InsectScanner />)
    await user.click(screen.getByRole('button', { name: /Unclear photo/ }))
    await user.click(screen.getByRole('button', { name: /Identify insect/ }))
    expect(screen.getByText(/consider checking the identification manually/)).toBeInTheDocument()
  })

  it('switching samples after identifying hides the stale result until re-identified', async () => {
    const user = userEvent.setup()
    render(<InsectScanner />)
    await user.click(screen.getByRole('button', { name: /Identify insect/ }))
    expect(screen.getByTestId('scanner-result')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Aphid/ }))
    expect(screen.queryByTestId('scanner-result')).not.toBeInTheDocument()
  })

  it('always shows the mock-AI disclaimer', () => {
    render(<InsectScanner />)
    expect(screen.getByText(/not a live AI model/)).toBeInTheDocument()
  })
})
