import React from 'react'
import './App.scss'
import Navbar from './components/Navbar'
import GroupView from './components/GroupView'
import HomePage from './components/HomePage'
import CreateGroup from './components/CreateGroup'
import { Switch, Route } from 'react-router-dom'
import GroupNewPost from './components/GroupNewPost'
import GroupList from './components/GroupList'
import PostView from './components/PostView'
import Footer from './components/Footer'
import GroupScheduler from './components/GroupScheduler'

// webpack-dev-server does not refresh the browser when code is updated
// due to this bug: https://github.com/webpack/webpack-dev-server/issues/2758
// TODO: either upgrade to the webpack beta or wait for bugfix

const App = () => {
  return (
    <div>
      <Navbar />
      <div className='container' style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <Switch>
          <Route path="/groups/create">
            <CreateGroup />
          </Route>
          <Route path="/groups/:id/schedule">
            <GroupScheduler />
          </Route>
          <Route path="/groups/:id/submit">
            <GroupNewPost />
          </Route>
          <Route path="/groups/:id/:pid">
            <PostView />
          </Route>
          <Route path="/groups/:id">
            <GroupView />
          </Route>
          <Route path="/groups">
            <GroupList />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default App