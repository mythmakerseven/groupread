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

const App = () => {
  return (
    <div>
      <Navbar />
      <div className='container pt-4 pb-4'>
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