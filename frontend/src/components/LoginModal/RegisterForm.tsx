import React from 'react'
import { useForm } from 'react-hook-form'
import { registerUser } from '../../reducers/userReducer'
import { useAppDispatch } from '../../hooks'
import { ErrorMessage } from '@hookform/error-message'
import { RegisterData } from '../../types'

interface Props {
  setOpen(boolean: boolean): void
}

const RegisterForm: React.FC<Props> = ({ setOpen }) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
    },
  } = useForm()

  const handleRegister = async (data: RegisterData) => {
    const userCredentials = {
      username: data.username,
      displayName: data.displayName,
      password: data.password,
      email: data.email,
    }

    try {
      await dispatch(registerUser(userCredentials))
      setOpen(false)
    } catch(e) {
      return setError('username', { message: `${e.message}` })
    }
  }

  return (
    (
      <form key={2} onSubmit={handleSubmit(handleRegister)}>
        <ErrorMessage errors={errors} name='username' />
        <div className='field'>
          <label className='label'>Username</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='username'
              {...register('username', {
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
        <ErrorMessage errors={errors} name='displayName' />
        <div className='field'>
          <label className='label'>Display Name</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='My Name'
              {...register('displayName', {
                required:
                {
                  value: true,
                  message: 'Display name is required'
                },
                maxLength: {
                  value: 32,
                  message: 'Display name must be fewer than 32 characters'
                }
              })} />
          </div>
        </div>
        <ErrorMessage errors={errors} name='password' />
        <div className='field'>
          <label className='label'>Password</label>
          <div className='control'>
            <input
              className='input'
              type='password'
              placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
              {...register('password', {
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
        <ErrorMessage errors={errors} name='email' />
        <div className='field'>
          <label className='label'>Email</label>
          <div className='control'>
            <input
              className='input'
              type='email'
              placeholder='you@example.com'
              {...register('email', {
                required:
                {
                  value: true,
                  message: 'Email is required'
                }
              })} />
          </div>
        </div>
        <button className='button is-success' type="submit">Register</button>
      </form>
    )
  )
}

export default RegisterForm