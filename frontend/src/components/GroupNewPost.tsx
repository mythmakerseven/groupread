import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../hooks'
import { newPost } from '../reducers/groupReducer'
import { ErrorMessage } from '@hookform/error-message'

const GroupNewPost: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
    },
  } = useForm()

  const user = useAppSelector(({ user }) => user)

  if (!user) {
    return (
      <p>You are not authorized to view this page.</p>
    )
  }

  const handlePost = async (data) => {
    const postObject = {
      title: data.title,
      text: data.text,
    }

    const res = await dispatch(newPost({
      id: id,
      postObject: postObject
    }))

    if (res.error) {
      return setError('title', { message: `${res.error.message}` })
    }

    history.push(`/groups/${id}`)
  }

  return (
    <div className='container pt-4 pb-4'>
      <h1 className='title'>New post</h1>
      <form onSubmit={handleSubmit(handlePost)}>
        <ErrorMessage errors={errors} name='title' message='Title is required' />
        <div className='field'>
          <label className='label'>Title</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              {...register('title', { required: true })}
              placeholder='Title goes here' />
          </div>
        </div>
        <ErrorMessage errors={errors} name='text' message='We need some text here' />
        <div className='field'>
          <label className='label'>Text</label>
          <p className='has-text-weight-light is-size-7'>You can format your post with <a href="https://www.markdownguide.org/cheat-sheet/">Markdown</a></p>
          <div className='control'>
            <textarea
              className='textarea'
              {...register('text', { required: true })}
              placeholder='Type something here'
              rows={10} />
          </div>
        </div>
        <button className='button is-primary' type='submit'>Submit post</button>
      </form>
    </div>
  )
}

export default GroupNewPost