import * as React from 'react'
import { mount } from '@cypress/react'
import Navbar from '.'
import { Provider } from 'react-redux'
import store from '../../store'
import { BrowserRouter as Router } from 'react-router-dom'

// TODO: test mobile functionality for navbar
// e.g. burger menu, etc

describe('Navbar', () => {
  beforeEach(() => {
    mount(
      <Router>
        <Provider store={store}>
          <Navbar />
        </Provider>
      </Router>
    )
  })

  it('displays Home button that links to homepage', () => {
    cy.get('#nav-home-link').should('have.attr', 'href', '/')
  })

  it('displays login link when logged out', () => {
    cy.get('#login-button').contains('Log in or Register')
  })

  it('does not display logout button when logged out', () => {
    cy.get('#logout-button').should('not.exist')
  })

  it('does not display group creation button when logged out', () => {
    cy.get('#create-group-button').should('not.exist')
  })
})