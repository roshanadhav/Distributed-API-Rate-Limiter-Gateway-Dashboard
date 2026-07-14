import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/leadership', label: 'Leadership' },
  { to: '/gallery', label: 'Gallery' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">RA</span>
          <span className="brand-full">Rohan Adhav</span>
        </NavLink>

        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <div className="nav-right">
          <nav className={`nav-links${open ? ' open' : ''}`}>
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      </div>
    </header>
  )
}
