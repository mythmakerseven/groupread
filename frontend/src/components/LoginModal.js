import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { logInUser, registerUser } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { Button, Modal, Form, Menu, Segment } from 'semantic-ui-react'
import { ErrorMessage } from '@hookform/error-message'

const LoginModal = () => {
  const [open, setOpen] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  const dispatch = useDispatch()
  const { register, handleSubmit, setError, errors } = useForm()

  // TODO: more client-side validation on both forms,
  // especially password length
  const handleForm = () => {
    if (!showRegisterForm) {
      return (
        <Form
          onSubmit={handleSubmit(handleLogin)}
        >
          <ErrorMessage errors={errors} name='loginUsername' message='Username is required' />
          <Form.Field>
            <label>Username</label>
            <input name="loginUsername" ref={register({ required: true })} />
          </Form.Field>
          <ErrorMessage errors={errors} name='password' message='Password is required' />
          <Form.Field>
            <label>Password</label>
            <input name="loginPassword" type="password" ref={register({ required: true })} />
          </Form.Field>
          <Button type="submit">Log In</Button>
        </Form>
      )
    } else {
      return (
        <Form
          onSubmit={handleSubmit(handleRegister)}
        >
          <ErrorMessage errors={errors} name='registerUsername' message='Username is required' />
          <Form.Field>
            <label>Username</label>
            <input name="registerUsername" ref={register({ required: true })} />
            {errors.username && 'Username is required'}
          </Form.Field>
          <ErrorMessage errors={errors} name='password' message='Password is required' />
          <Form.Field>
            <label>Password</label>
            <input name="registerPassword" type="password" ref={register({ required: true })} />
            {errors.password && 'Password is required'}
          </Form.Field>
          <ErrorMessage errors={errors} name='email' message='Email is required' />
          <Form.Field>
            <label>Email</label>
            <input name='registerEmail' type="email" ref={register({ required: true })} />
            {errors.email && 'Email is required'}
          </Form.Field>
          <Button type="submit">Register</Button>
        </Form>
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
  }

  return (
    <Modal
      size='tiny'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Menu.Item position='right'>Log In/Register</Menu.Item>}
    >
      <Modal.Content>
        <Menu attached='top' tabular>
          <Menu.Item
            name='login'
            onClick={() => setShowRegisterForm(false)}
            active={!showRegisterForm}
          />
          <Menu.Item
            name='register'
            onClick={() => setShowRegisterForm(true)}
            active={showRegisterForm}
          />
        </Menu>
        <Segment attached>
          {handleForm()}
        </Segment>
      </Modal.Content>
    </Modal>
  )
}

export default LoginModal