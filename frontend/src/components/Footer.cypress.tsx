import * as React from 'react'
import { mount } from '@cypress/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Footer from './Footer'

// simple one to make sure cypress is working
it('Footer', () => {
  mount(
  <Router>
    <Footer />
  </Router>)
  cy.get('footer').contains('Book metadata provided by the')
})