import React from 'react'
import { useForm } from 'react-hook-form'
import { logInUser } from '../../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { ErrorMessage } from '@hookform/error-message'
import { LoginData } from '../../types'

interface Props {
  setOpen(boolean: boolean): void
}

const LoginForm: React.FC<Props> = ({ setOpen }) => {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
    },
  } = useForm()

  const handleLogin = async (data: LoginData) => {
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

  return (
    <form key={1} onSubmit={handleSubmit(handleLogin)}>
      <ErrorMessage errors={errors} name='loginUsername' />
      <div className='field'>
        <label className='label'>Username</label>
        <div className='control'>
          <input
            className='input'
            type='text'
            placeholder='username'
            {...register('loginUsername', {
              required:
              {
                value: true,
                message: 'Username is required'
              },
              maxLength: {
                value: 32,
                message: 'Username must be fewer than 32 characters'
              }
            })} />
        </div>
      </div>
      <ErrorMessage errors={errors} name='loginPassword' />
      <div className='field'>
        <label className='label'>Password</label>
        <div className='control'>
          <input
            className='input'
            type='password'
            placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
            {...register('loginPassword', {
              required:
              {
                value: true,
                message: 'Password is required'
              },
              minLength:
              {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })} />
        </div>
      </div>
      <button className='button is-success' type="submit">Log In</button>
    </form>
  )
}

export default LoginForm