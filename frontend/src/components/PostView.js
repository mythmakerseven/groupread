import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'
import { ErrorMessage } from '@hookform/error-message'
import { newPost } from '../reducers/groupReducer'

const PostView = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, setValue, setError, errors } = useForm()
  const { id, pid } = useParams()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupPosts(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  if (!group || !group.posts || !group.members) {
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

    setValue('text', '')
  }

  const findUser = id => {
    const userMatch = group.members.find(m => m.id === id)
    if (!userMatch) return 'unknown'
    return userMatch.username
  }

  const displayReplies = posts => {
    return posts.map(post => (
      <article className='media has-background-light has-text-black p-4 is-family-primary' key={post.id}>
        <div className='media-content'>
          <div className='content'>
            <p><strong>{findUser(post.UserId)}</strong> <small>{post.createdAt.substring(5,10)}</small>
              <br />
              {post.text}
            </p>
          </div>
        </div>
      </article>
    ))
  }

  return (
    <div>
      <h1 className='title'>{post.title}</h1>
      <div className='has-background-light has-text-black p-4'>
        <p><strong>{findUser(post.UserId)}</strong> <small>{post.createdAt.substring(5,10)}</small></p>
        <p >{post.text}</p>
      </div>
      <br />
      <h1 className='title is-4'>Replies</h1>
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