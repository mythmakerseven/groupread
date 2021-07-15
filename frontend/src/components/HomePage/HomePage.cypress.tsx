import React from 'react'
import { mount } from '@cypress/react'
import HomePage from './index'
import { BrowserRouter as Router } from 'react-router-dom'

describe('HomePage', () => {
  beforeEach(() => {
    mount(
      <Router>
        <HomePage />
      </Router>)
  })

  it('displays the Groupread name', () => {
    cy.get('#home-page').contains('Groupread')
  })

  it('has visible background image', () => {
    // no simple way to check that it's the correct image,
    // so let's just check that there's an image at all
    cy.get('#home-page').should('have.css', 'background-image')
  })

  it('links to the group listing page', () => {
    cy.get('#group-list-link').should('have.attr', 'href', '/groups')
  })
})