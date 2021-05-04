import React, { useEffect } from 'react'
import './App.scss'
import './custom.scss'
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
import Compatibility from './components/Compatibility'
import { initializeUser } from './reducers/userReducer'
import { useAppDispatch } from './hooks'

const App: React.FC = () => {
  const dispatch = useAppDispatch()

  // Put the user into state as soon as they load the site
  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  return (
    <div>
      <Navbar />
      <div className='navbar-offset'>
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
          <Route path="/compatibility">
            <Compatibility />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
        <Footer />
      </div>
    </div>
  )
}

export default App