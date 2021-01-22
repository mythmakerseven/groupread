import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal'
import { initializeUser, logOutUser } from '../reducers/userReducer'

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const user = useSelector(({ user }) => user)

  const handleLoginModal = () => {
    if (!openModal) {
      return null
    }

    return <LoginModal
      open={openModal}
      setOpen={setOpenModal}
    />
  }

  const checkLogin = () => {
    if (user) {
      return (
        <>
          <div className='navbar-end'>
            <Link className='navbar-item' to='/group/create'>
              Create Group
            </Link>
            <a className='navbar-item' onClick={() => dispatch(logOutUser())}>
              Log out
            </a>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className='navbar-end'>
            <a className='navbar-item' onClick={() => setOpenModal(true)}>
            Log in
            </a>
          </div>
        </>
      )
    }
  }

  // use Button component for login link
  return (
    <nav className='navbar' aria-label='main navigation'>
      {handleLoginModal()}
      <div className='navbar-brand'>
        <Link className='navbar-item' to='/'>Home</Link>
      </div>
      <div className='navbar-menu'>
        {checkLogin()}
      </div>
    </nav>
  )
}

export default Navbar