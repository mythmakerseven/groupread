import React from 'react'
import { useAppDispatch } from '../../hooks'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { editPost, newPost } from '../../reducers/groupReducer'

export enum PostPayloadType {
  New,
  Edit
}

interface Props {
  payloadType: PostPayloadType,
  startingText: string | null,
  replyID: string | null,
  setActive: ((arg0: boolean) => void) | null
}

const ReplyForm: React.FC<Props> = ({ payloadType, startingText, replyID, setActive }) => {
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
    let res

    try {
      if (payloadType === PostPayloadType.New) {
        const postObject = {
          text: data.text,
          parent: pid
        }

        res = await dispatch(newPost({
          id: id,
          postObject: postObject
        }))
      }

      if (payloadType === PostPayloadType.Edit && replyID) {
        const postObject = {
          text: data.text
        }

        // If the form is hidable, hide it
        if (setActive) {
          setActive(false)
        }

        res = await dispatch(editPost({
          postID: replyID,
          postObject: postObject
        }))
      }
      if (!res) {
        return setError('text', { message: 'We\'re having trouble connecting to the server' })
      }
    } catch(e) {
      return setError('text', { message: `${e.message}` })
    }


    setValue('text', '')
  }

  return (
    <form onSubmit={handleSubmit(handlePost)}>
      <ErrorMessage errors={errors} name='text' message='This can&apos;t be empty' />
      <div className='field'>
        <p className='has-text-weight-light is-size-7'>You can format your post with <a href="https://www.markdownguide.org/cheat-sheet/">Markdown</a></p>
        <div className='control'>
          <textarea
            className='textarea'
            {...register('text', { required: true })}
            placeholder='Type something here'
            defaultValue={startingText ? startingText : undefined}
            rows={6}
          />
        </div>
      </div>
      <button className='button is-primary' type='submit'>Submit</button>
      {payloadType === PostPayloadType.Edit && setActive
        ? <button className='button is-secondary' type='button' onClick={() => setActive(false)}>Cancel</button>
        : null
      }
    </form>
  )
}

export default ReplyForm