import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { logInUser, registerUser } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { ErrorMessage } from '@hookform/error-message'
import PropTypes from 'prop-types'

const LoginModal = ({ open, setOpen }) => {
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  const dispatch = useDispatch()
  const { register, handleSubmit, setError, errors } = useForm()

  // TODO: more client-side validation on both forms,
  // especially password length
  const handleForm = () => {
    if (!showRegisterForm) {
      return (
        <form onSubmit={handleSubmit(handleLogin)}>
          <ErrorMessage errors={errors} name='loginUsername' message='Username is required' />
          <div className='field'>
            <label className='label'>Username</label>
            <div className='control'>
              <input
                className='input'
                type='text'
                placeholder='username'
                name='loginUsername'
                ref={register({ required: true })}
              />
            </div>
          </div>
          <ErrorMessage errors={errors} name='loginPassword' message='Password is required' />
          <div className='field'>
            <label className='label'>Password</label>
            <div className='control'>
              <input
                className='input'
                type='password'
                placeholder='**********'
                name='loginPassword'
                ref={register({ required: true })}
              />
            </div>
          </div>
          <button className='button is-success' type="submit">Log In</button>
        </form>
      )
    } else {
      return (
        <form onSubmit={handleSubmit(handleRegister)}>
          <ErrorMessage errors={errors} name='registerUsername' message='Username is required' />
          <div className='field'>
            <label className='label'>Username</label>
            <div className='control'>
              <input
                className='input'
                type='text'
                placeholder='username'
                name='registerUsername'
                ref={register({ required: true })}
              />
              {errors.username && 'Username is required'}
            </div>
          </div>
          <ErrorMessage errors={errors} name='password' message='Password is required' />
          <div className='field'>
            <label className='label'>Password</label>
            <div className='control'>
              <input
                className='input'
                type='password'
                placeholder='**********'
                name='registerPassword'
                ref={register({ required: true })}
              />
              {errors.password && 'Password is required'}
            </div>
          </div>
          <ErrorMessage errors={errors} name='email' message='Email is required' />
          <div className='field'>
            <label className='label'>Email</label>
            <div className='control'>
              <input
                className='input'
                type='email'
                placeholder='you@example.com'
                name='registerEmail'
                ref={register({ required: true })}
              />
            </div>
            {errors.email && 'Email is required'}
          </div>
          <button className='button is-success' type="submit">Register</button>
        </form>
      )
    }
  }

  const handleLogin = async (data) => {
    const userCredentials = {
      username: data.loginUsername,
      password: data.loginPassword
    }
    const res = await dispatch(logInUser(userCredentials))
    if (res.error) {
      return setError('loginUsername', { message: `${res.error}` })
    }
    setOpen(false)
  }

  const handleRegister = async (data) => {
    const userCredentials = {
      username: data.registerUsername,
      password: data.registerPassword,
      email: data.registerEmail
    }

    const res = await dispatch(registerUser(userCredentials))
    if (res.error) {
      return setError('registerUsername', { message: `${res.error}` })
    }
    setOpen(false)
  }

  return (
    <div className={open ? 'modal is-active' : 'modal'}>
      <div className='modal-background' onClick={() => setOpen(false)} />
      <div className='modal-content'>
        <div className='box'>
          <div className='tabs'>
            <ul>
              <li className={showRegisterForm ? null : 'is-active'} onClick={() => setShowRegisterForm(false)}><a>Log in</a></li>
              <li className={showRegisterForm ? 'is-active' : null} onClick={() => setShowRegisterForm(true)}><a>Register</a></li>
            </ul>
          </div>
          {handleForm()}
        </div>
      </div>
      <button className='modal-close is-large' aria-label='close' onClick={() => setOpen(false)} />
    </div>
  )
}

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
}

export default LoginModal