import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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

    history.push(`/groups/${id}`)
  }

  return (
    <div>
      <h1 className='title'>New post</h1>
      <form onSubmit={handleSubmit(handlePost)}>
        <ErrorMessage errors={errors} name='title' message='Title is required' />
        <div className='field'>
          <label className='label'>Title</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              name='title'
              placeholder='Title goes here'
              ref={register( { required: true })}
            />
          </div>
        </div>
        <ErrorMessage errors={errors} name='text' message='We need some text here' />
        <div className='field'>
          <label className='label'>Text</label>
          <div className='control'>
            <textarea
              className='textarea'
              name='text'
              placeholder='Type something here'
              rows={10}
              ref={register({ required: true })}
            />
          </div>
        </div>
        <button className='button is-primary' type='submit'>Submit post</button>
      </form>
    </div>
  )
}

export default GroupNewPost