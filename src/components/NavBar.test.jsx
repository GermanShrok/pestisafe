import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NavBar from './NavBar'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavBar />
      <Routes>
        <Route path="/" element={<div>DASHBOARD_PAGE</div>} />
        <Route path="/simulator" element={<div>SIMULATOR_PAGE</div>} />
        <Route path="/insect-scanner" element={<div>SCANNER_PAGE</div>} />
        <Route path="/pesticide-checker" element={<div>CHECKER_PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('NavBar', () => {
  it('renders the brand and primary links', () => {
    renderAt('/')
    expect(screen.getByText('PestiSafe')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Dashboard/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Try the simulator/ })).toBeInTheDocument()
  })

  it('the Demos dropdown is closed by default', () => {
    renderAt('/')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens the Demos dropdown on click and lists all three demo pages', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /Demos/ }))
    const menu = screen.getByRole('menu')
    expect(within(menu).getByRole('menuitem', { name: /Spraying simulator/ })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /AI insect scanner/ })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: /Pesticide checker/ })).toBeInTheDocument()
  })

  it('navigates to the insect scanner page via the dropdown and closes the menu', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: /Demos/ }))
    await user.click(screen.getByRole('menuitem', { name: /AI insect scanner/ }))
    expect(screen.getByText('SCANNER_PAGE')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('navigates to the simulator page via the CTA button', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /Try the simulator/ }))
    expect(screen.getByText('SIMULATOR_PAGE')).toBeInTheDocument()
  })

  it('navigates back to the dashboard via the brand link', async () => {
    const user = userEvent.setup()
    renderAt('/simulator')
    await user.click(screen.getByRole('link', { name: /PestiSafe/ }))
    expect(screen.getByText('DASHBOARD_PAGE')).toBeInTheDocument()
  })
})
