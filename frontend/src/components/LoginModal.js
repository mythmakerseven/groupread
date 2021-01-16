import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { logInUser, registerUser } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { Button, Modal, Form, Menu, Segment } from 'semantic-ui-react'

const LoginModal = () => {
  const [open, setOpen] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm()

  // TODO: error handling and validation on both forms
  const handleForm = () => {
    if (!showRegisterForm) {
      return (
        <Form
          onSubmit={handleSubmit(handleLogin)}
        >
          <Form.Field>
            <label>Username</label>
            <input name="username" ref={register({ required: true })} />
            {errors.username && 'Username is required'}
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input name="password" type="password" ref={register({ required: true })} />
            {errors.password && 'Password is required'}
          </Form.Field>
          <Button type="submit">Log In</Button>
        </Form>
      )
    } else {
      return (
        <Form
          onSubmit={handleSubmit(handleRegister)}
        >
          <Form.Field>
            <label>Username</label>
            <input name="username" ref={register({ required: true })} />
            {errors.username && 'Username is required'}
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input name="password" type="password" ref={register({ required: true })} />
            {errors.password && 'Password is required'}
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input name='email' type="email" ref={register({ required: true })} />
            {errors.email && 'Email is required'}
          </Form.Field>
          <Button type="submit">Register</Button>
        </Form>
      )
    }
  }

  const handleLogin = async (data) => {
    const userCredentials = {
      username: data.username,
      password: data.password
    }

    dispatch(logInUser(userCredentials))
  }

  const handleRegister = async (data) => {
    const userCredentials = {
      username: data.username,
      password: data.password,
      email: data.email
    }

    dispatch(registerUser(userCredentials))
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