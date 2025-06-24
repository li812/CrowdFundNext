import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './Home.css'

import HomePage from './HomePage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      tabIndex={0}
    >
      {theme === 'dark' ? (
        <span role="img" aria-label="Light mode">🌞</span>
      ) : (
        <span role="img" aria-label="Dark mode">🌙</span>
      )}
    </button>
  )
}

function NavBar() {
  const location = useLocation()
  return (
    <nav className="glass-navbar" role="navigation" aria-label="Main navigation">
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        </li>
        <li>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </li>
        <li>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </li>
        <li className="right">
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Sign In</Link>
        </li>
        <li>
          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Sign Up</Link>
        </li>
      </ul>
    </nav>
  )
}

function HomeBase() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <Router>
      <div>
        <div className="navbar-container">
          <NavBar />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        <main className="glass-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default HomeBase