import React from 'react'
import { useForm } from 'react-hook-form'
import { registerUser } from '../../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { ErrorMessage } from '@hookform/error-message'

interface Props {
  setOpen(boolean: boolean): void
}

const RegisterForm: React.FC<Props> = ({ setOpen }) => {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
    },
  } = useForm()

  const handleRegister = async (data) => {
    const userCredentials = {
      username: data.registerUsername,
      displayName: data.registerDisplayName,
      password: data.registerPassword,
      email: data.registerEmail,
    }

    const res = await dispatch(registerUser(userCredentials))
    if (res.error) {
      return setError('registerUsername', { message: `${res.error}` })
    }
    setOpen(false)
  }

  return (
    (
      <form key={2} onSubmit={handleSubmit(handleRegister)}>
        <ErrorMessage errors={errors} name='registerUsername' />
        <div className='field'>
          <label className='label'>Username</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='username'
              {...register('registerUsername', {
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
        <ErrorMessage errors={errors} name='registerDisplayName' />
        <div className='field'>
          <label className='label'>Display Name</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='My Name'
              {...register('registerDisplayName', {
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
        <ErrorMessage errors={errors} name='registerPassword' />
        <div className='field'>
          <label className='label'>Password</label>
          <div className='control'>
            <input
              className='input'
              type='password'
              placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
              {...register('registerPassword', {
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
        <ErrorMessage errors={errors} name='registerEmail' />
        <div className='field'>
          <label className='label'>Email</label>
          <div className='control'>
            <input
              className='input'
              type='email'
              placeholder='you@example.com'
              {...register('registerEmail', {
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