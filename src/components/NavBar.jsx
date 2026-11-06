import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const DEMO_LINKS = [
  { to: '/simulator', label: 'Spraying simulator' },
  { to: '/insect-scanner', label: 'AI insect scanner' },
  { to: '/pesticide-checker', label: 'Pesticide checker' },
]

const linkClass = ({ isActive }) => `navbar__link${isActive ? ' active' : ''}`

export default function NavBar() {
  const [demosOpen, setDemosOpen] = useState(false)
  const closeTimeout = useRef(null)

  const closeDemos = () => setDemosOpen(false)

  return (
    <nav className="navbar" aria-label="Main">
      <Link to="/" className="navbar__brand" onClick={closeDemos}>
        <span aria-hidden="true">🐝</span> PestiSafe
      </Link>

      <div className="navbar__links">
        <NavLink to="/" end className={linkClass} onClick={closeDemos}>
          Dashboard
        </NavLink>

        <div
          className="navbar__dropdown"
          onMouseLeave={() => {
            closeTimeout.current = setTimeout(closeDemos, 150)
          }}
          onMouseEnter={() => clearTimeout(closeTimeout.current)}
        >
          <button
            type="button"
            className="navbar__link navbar__dropdown-trigger"
            aria-haspopup="true"
            aria-expanded={demosOpen}
            onClick={() => setDemosOpen((open) => !open)}
          >
            Demos ▾
          </button>
          {demosOpen && (
            <ul className="navbar__dropdown-menu" role="menu">
              {DEMO_LINKS.map((link) => (
                <li key={link.to} role="none">
                  <NavLink to={link.to} role="menuitem" onClick={closeDemos}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        <NavLink to="/simulator" className="navbar__link navbar__link--cta" onClick={closeDemos}>
          Try the simulator
        </NavLink>
      </div>
    </nav>
  )
}
