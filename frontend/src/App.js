import React from 'react'
import 'semantic-ui-css/semantic.min.css'

import Navbar from './components/Navbar'
import GroupView from './components/GroupView'
import HomePage from './components/HomePage'
import CreateGroup from './components/CreateGroup'
import { Container } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'

// webpack-dev-server does not refresh the browser when code is updated
// due to this bug: https://github.com/webpack/webpack-dev-server/issues/2758
// TODO: either upgrade to the webpack beta or wait for bugfix

const App = () => {
  return (
    <div>
      <Navbar />
      <Container style={{ position: 'relative', top: '60px' }}>
        <Switch>
          <Route path="/group/create">
            <CreateGroup />
          </Route>
          <Route path="/group/:id">
            <GroupView />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Container>
    </div>
  )
}

export default App