import React from 'react'
import 'semantic-ui-css/semantic.min.css'

import GroupView from './components/GroupView'
import HomePage from './components/HomePage'

import { Container, Header } from 'semantic-ui-react'

import { Switch, Route, Link } from 'react-router-dom'

// webpack-dev-server does not refresh the browser when code is updated
// due to this bug: https://github.com/webpack/webpack-dev-server/issues/2758
// TODO: either upgrade to the webpack beta or wait for bugfix

const App = () => {
  return (
    <Container>
      <Header as='h1'><Link to='/'>Group Read</Link></Header>

      <Switch>
        <Route path="/group/:id">
          <GroupView />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>

    </Container>
  )
}

export default App