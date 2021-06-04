import React from 'react'
import { mount } from '@cypress/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../store'
import GroupScheduler from './index'

// TODO: the whole test
it('GroupScheduler', () => {
  mount(
    <Router>
      <Provider store={store}>
        <GroupScheduler />
      </Provider>
    </Router>
  )
})