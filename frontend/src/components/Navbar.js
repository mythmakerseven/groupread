import React, { useEffect } from 'react'
import { Menu } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LoginModal from './LoginModal'
import { initializeUser, logOutUser } from '../reducers/userReducer'

const Navbar = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const user = useSelector(({ user }) => user)
  console.log(user)

  const handleLogin = () => {
    if (user) {
      return (
        <>
          <Menu.Item
            position='right'
            name='createGroup'
            onClick={() => history.push('/group/create')}
          />
          <Menu.Item
            name='logOut'
            onClick={() => dispatch(logOutUser())}
          />
        </>
      )
    } else {
      return (
        <LoginModal />
      )
    }
  }

  // use Button component for login link
  return (
    <Menu size='large' fixed='top'>
      <Menu.Item
        name='home'
        onClick={() => history.push('/')}
      />
      {handleLogin()}
    </Menu>
  )
}

export default Navbar