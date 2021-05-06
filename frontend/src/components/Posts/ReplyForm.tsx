import React from 'react'
import { useAppDispatch } from '../../hooks'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { newPost } from '../../reducers/groupReducer'

const ReplyForm: React.FC = () => {
  const { id, pid } = useParams<({ id: string, pid: string })>()

  const {
    register,
    handleSubmit,
    setValue,
    setError,

    formState: {
      errors,
    },
  } = useForm()

  const dispatch = useAppDispatch()

  const handlePost = async (data: { text: string }) => {
    const postObject = {
      text: data.text,
      parent: pid
    }

    const res = await dispatch(newPost({
      id: id,
      postObject: postObject
    }))

    if (res.error) {
      return setError('text', { message: `${res.error.message}` })
    }

    setValue('text', '')
  }

  return (
    <form onSubmit={handleSubmit(handlePost)}>
      <ErrorMessage errors={errors} name='text' message='This can&apos;t be empty' />
      <div className='field'>
        <label className='label'>Reply</label>
        <p className='has-text-weight-light is-size-7'>You can format your post with <a href="https://www.markdownguide.org/cheat-sheet/">Markdown</a></p>
        <div className='control'>
          <textarea
            className='textarea'
            {...register('text', { required: true })}
            placeholder='Type something here'
            rows={6} />
        </div>
      </div>
      <button className='button is-primary' type='submit'>Submit</button>
    </form>
  )
}

export default ReplyForm