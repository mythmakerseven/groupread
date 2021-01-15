import React from 'react'
import { Menu } from 'semantic-ui-react'
import { useSelector, useHistory } from 'react-router-dom'

const Navbar = () => {
  const history = useHistory()

  const user = useSelector(({ user }) => user)

  const handleLogin = () => {
    if (user) {
      return <p>logged in!</p>
    } else {
      return <p>not logged in :(</p>
    }
  }

  // use Button component for login link
  return (
    <Menu size='large' fixed='top'>
      <Menu.Item
        name='home'
        onClick={() => history.push('/')}
      />
      <Menu.Item
        position='right'
        name='createGroup'
        onClick={() => history.push('/group/create')}
      />
    </Menu>
  )
}

export default Navbar