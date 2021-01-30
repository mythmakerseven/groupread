import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupPosts } from '../reducers/groupReducer'
import { ErrorMessage } from '@hookform/error-message'
import { newPost } from '../reducers/groupReducer'

const PostView = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, setError, errors } = useForm()
  const { id, pid } = useParams()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupPosts(id))
  }, [id])

  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  if (!group || !group.posts) {
    return (
      <p>loading...</p>
    )
  }

  const post = group.posts.find(post => post.id === pid)

  if (!post) {
    return (
      <p>post not found :(</p>
    )
  }

  const handlePost = async data => {
    const postObject = {
      title: data.title,
      text: data.text,
      parent: pid
    }

    const res = await dispatch(newPost(id, postObject))

    if (res.error) {
      return setError('text', { message: `${res.error}` })
    }
  }

  // I <3 recursion
  // This function should still work if support for infinitely nested comments is added
  const displayReplies = posts => {
    return posts.map(post => {
      if (post.replies) {
        return (
          <div key={post.id}>
            <li>{post.text}</li>
            <ol>
              {displayReplies(post.replies)}
            </ol>
          </div>
        )
      } else {
        return <li key={post.id}>{post.text}</li>
      }
    })
  }

  return (
    <div>
      <h1 className='title'>{post.title}</h1>
      <p>{post.text}</p>
      <h1 className='subtitle'>Replies</h1>
      {displayReplies(post.replies)}
      <form onSubmit={handleSubmit(handlePost)}>
        <ErrorMessage errors={errors} name='text' message='This can&apos;t be empty' />
        <div className='field'>
          <label className='label'>Reply</label>
          <div className='control'>
            <textarea
              className='textarea'
              name='text'
              placeholder='Type something here'
              rows={6}
              ref={register({ required: true })}
            />
          </div>
        </div>
        <button className='button is-primary' type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default PostView