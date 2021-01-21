import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Header, Form, Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { newPost } from '../reducers/groupReducer'
import { ErrorMessage } from '@hookform/error-message'

const GroupNewPost = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  const { register, handleSubmit, setError, errors } = useForm()

  const user = useSelector(({ user }) => user)

  if (!user) {
    return (
      <p>You are not authorized to view this page.</p>
    )
  }

  const handlePost = async data => {
    const postObject = {
      title: data.title,
      text: data.text,
    }

    const res = await dispatch(newPost(id, postObject))

    if (res.error) {
      return setError('title', { message: `${res.error}` })
    }

    history.push(`/group/${id}`)
  }

  return (
    <div>
      <Header as='h1'>New post</Header>
      <Form onSubmit={handleSubmit(handlePost)}>
        <ErrorMessage errors={errors} name='title' message='Title is required' />
        <Form.Field>
          <label>Title</label>
          <input name='title' placeholder='Title' ref={register( { required: true })} />
        </Form.Field>
        <ErrorMessage errors={errors} name='text' message='We need some text here' />
        <Form.Field>
          <label>Text</label>
          <textarea name='text' placeholder='Type something here' rows={10} ref={register( { required: true })} />
        </Form.Field>
        <Button type='submit'>Submit post</Button>
      </Form>
    </div>
  )
}

export default GroupNewPost