import React from 'react'
import './Home.css'

import HomePage from './HomePage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { BrowserRouter as Router, Route } from 'react-router-dom'


function HomeBase() {
  return (
    <div>
      <h1>CrowdFundNext</h1>
      <p>Your one-stop platform for innovative crowdfunding.</p>
    </div>
  )
}

export default HomeBase
export function HomeRoutes() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
    </Router>
  )
}