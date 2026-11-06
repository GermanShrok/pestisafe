import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders the Dashboard at the root route', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: /Live farm safety monitor/ })).toBeInTheDocument()
  })

  it('renders the simulator at /simulator', () => {
    renderAt('/simulator')
    expect(screen.getByRole('heading', { name: /Spraying risk simulator/ })).toBeInTheDocument()
  })

  it('renders the insect scanner at /insect-scanner', () => {
    renderAt('/insect-scanner')
    expect(screen.getByRole('heading', { name: /AI insect scanner/ })).toBeInTheDocument()
  })

  it('renders the pesticide checker at /pesticide-checker', () => {
    renderAt('/pesticide-checker')
    expect(screen.getByRole('heading', { name: /Pesticide checker/ })).toBeInTheDocument()
  })

  it('navigates from the dashboard to the simulator via the nav CTA', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /Try the simulator/ }))
    expect(screen.getByRole('heading', { name: /Spraying risk simulator/ })).toBeInTheDocument()
  })

  it('renders the student-project footer disclaimer on every page', () => {
    renderAt('/')
    expect(screen.getByText(/student research project/)).toBeInTheDocument()
  })
})
