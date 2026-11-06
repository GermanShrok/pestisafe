import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import PesticideChecker from './PesticideChecker'

describe('PesticideChecker', () => {
  it('defaults to Matador 120EC on canola, flowering, with pollinators detected, and shows a block warning', () => {
    render(<PesticideChecker />)
    expect(screen.getByRole('heading', { name: 'Matador 120EC' })).toBeInTheDocument()
    expect(screen.getByText('Crop selected: Canola')).toBeInTheDocument()
    expect(screen.getByTestId('checker-warning')).toHaveClass('checker__warning--block')
    expect(screen.getByTestId('checker-warning')).toHaveTextContent('Do not spray')
  })

  it('unchecking "pollinators detected" downgrades the warning to caution', async () => {
    const user = userEvent.setup()
    render(<PesticideChecker />)
    await user.click(screen.getByLabelText(/Pollinators detected nearby/))
    expect(screen.getByTestId('checker-warning')).toHaveClass('checker__warning--caution')
  })

  it('unchecking both flowering and pollinators clears the warning to OK', async () => {
    const user = userEvent.setup()
    render(<PesticideChecker />)
    await user.click(screen.getByLabelText(/Crop is currently flowering/))
    await user.click(screen.getByLabelText(/Pollinators detected nearby/))
    expect(screen.getByTestId('checker-warning')).toHaveClass('checker__warning--ok')
  })

  it('switching to a fungicide shows OK even with flowering and pollinators present', async () => {
    const user = userEvent.setup()
    render(<PesticideChecker />)
    await user.selectOptions(screen.getByLabelText(/Pesticide product/), 'example-fungicide')
    expect(screen.getByTestId('checker-warning')).toHaveClass('checker__warning--ok')
    expect(screen.getByText('Fungicide')).toBeInTheDocument()
  })

  it('shows the non-live-lookup disclaimer', () => {
    render(<PesticideChecker />)
    expect(screen.getByText(/not a live Canadian pesticide-label lookup/)).toBeInTheDocument()
  })
})
