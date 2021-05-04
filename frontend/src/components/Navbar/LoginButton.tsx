import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { initializeUser, logOutUser } from '../../reducers/userReducer'
import { Link } from 'react-router-dom'
import LoginModal from '../LoginModal'

const LoginButton: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)

  const user = useAppSelector(({ user }) => user)
  const dispatch = useAppDispatch()

  const handleLoginModal = () => {
    if (!openModal) {
      return null
    }

    return <LoginModal
      open={openModal}
      setOpen={setOpenModal}
    />
  }

  // This component also includes the "Create group" link
  if (user) {
    return (
      <>
        <Link
          id='create-group-button'
          className='navbar-item'
          to='/groups/create'
        >
          &#x1F527; Create Group
        </Link>
        <a
          id='logout-button'
          role='button'
          onClick={() => dispatch(logOutUser())}
          // Handle keyboard support for a11y
          tabIndex={0}
          className='navbar-item'
          onKeyDown={(e) => e.key === 'Enter' ?  dispatch(logOutUser()) : null}
        >
          &#x1F44B; Log out
        </a>
      </>
    )
  } else {
    return (
      <>
        {handleLoginModal()}
        <a
          id='login-button'
          role='button'
          onClick={() => setOpenModal(true)}
          // Handle keyboard support for a11y
          tabIndex={0}
          className='navbar-item'
          onKeyDown={(e) => e.key === 'Enter' ?  setOpenModal(true) : null}
        >
          &#x1F44B; Log in or Register
        </a>
      </>
    )
  }
}

export default LoginButton