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
import PostView from './components/Posts'
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
      {/* mobile-container doesn't do anything unless the user on on a small screen,
      in which case it provides side margins to all content, Unfortunately, it messes up
      the homepage picture, so we have to wrap each individual component in this div
      to avoid affecting the homepage. */}

      <div className='navbar-offset'>
        <Switch>
          <Route path="/groups/create">
            <div className="mobile-container">
              <CreateGroup />
            </div>
          </Route>
          <Route path="/groups/:id/schedule">
            <div className="mobile-container">
              <GroupScheduler />
            </div>
          </Route>
          <Route path="/groups/:id/submit">
            <div className="mobile-container">
              <GroupNewPost />
            </div>
          </Route>
          <Route path="/groups/:id/:pid">
            <div className="mobile-container">
              <PostView />
            </div>
          </Route>
          <Route path="/groups/:id">
            <div className="mobile-container">
              <GroupView />
            </div>
          </Route>
          <Route path="/groups">
            <div className="mobile-container">
              <GroupList />
            </div>
          </Route>
          <Route path="/compatibility">
            <div className="mobile-container">
              <Compatibility />
            </div>
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