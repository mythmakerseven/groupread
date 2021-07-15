import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../hooks'
import { newPost } from '../reducers/groupReducer'
import { ErrorMessage } from '@hookform/error-message'
import ErrorPage from './ErrorPage'
import { ErrorTypes } from '../types'

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

  const user = useAppSelector(({ user }) => user.data)

  if (!user) {
    return (
      <ErrorPage errorType={ErrorTypes.Unauthorized} />
    )
  }

  const handlePost = async (data: { title: string; text: string }) => {
    const postObject = {
      title: data.title,
      text: data.text,
    }

    try {
      await dispatch(newPost({
        id: id,
        postObject: postObject
      }))
      history.push(`/groups/${id}`)
    } catch(e) {
      return setError('title', { message: `${e.message}` })
    }
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