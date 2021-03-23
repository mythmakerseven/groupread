import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal'
import { initializeUser, logOutUser } from '../reducers/userReducer'

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
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
          <Link className='navbar-item' to='/groups/create'>
            &#x1F527; Create Group
          </Link>
          <a className='navbar-item' onClick={() => dispatch(logOutUser())}>
            &#x1F44B; Log out
          </a>
        </>
      )
    } else {
      return (
        <>
          <a className='navbar-item' onClick={() => setOpenModal(true)}>
            &#x1F44B; Log in or Register
          </a>
        </>
      )
    }
  }

  const checkIfActive = base => {
    return menuVisible
      ? `${base} is-active`
      : base
  }


  // use Button component for login link
  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      {handleLoginModal()}
      <div className='container'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/'>&#128218; Home</Link>
          <a role='button' className={checkIfActive('navbar-burger')} onClick={() => setMenuVisible(!menuVisible)} aria-label='menu' aria-expanded='false' data-target='navMenu'>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={checkIfActive('navbar-menu')} id='navMenu'>
          <div className='navbar-end'>
            {checkLogin()}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar