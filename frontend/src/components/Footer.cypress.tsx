import * as React from 'react'
import { mount } from '@cypress/react'
import Footer from './Footer'

// simple one to make sure cypress is working
it('Footer', () => {
  mount(<Footer />)
  cy.get('footer').contains('Book metadata provided by the')
})