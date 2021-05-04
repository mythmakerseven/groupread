import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'
import { ErrorMessage } from '@hookform/error-message'
import { newPost } from '../reducers/groupReducer'
import Reply from './Posts/Reply'
import { getDisplayName } from '../lib/posts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import {
  Post
} from '../types'

const PostView: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    setValue,
    setError,

    formState: {
      errors,
    },
  } = useForm()
  const { id, pid } = useParams<({ id: string, pid: string })>()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupPosts(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  const user = useAppSelector(({ user }) => user)
  const groups = useAppSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  if (!user) {
    return (
      <p>You are not authorized to view this page.</p>
    )
  }

  if (!group || !group.posts || !group.members) {
    return (
      <p>loading...</p>
    )
  }

  const post: Post | undefined = group.posts.find(post => post.id === pid)

  if (!post) {
    return (
      <p>post not found :(</p>
    )
  }

  const handlePost = async (data: { title: string; text: string }) => {
    const postObject = {
      title: data.title,
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

  const displayReplies = () => {
    // Check if there are any replies first
    if (post.replies && post.replies.length > 0) {
      return post.replies.map(reply => 
        <Reply key={reply.id} groupMembers={group.members} replyObject={reply} />
      )
    } else {
      return (
        <p className='subtitle'>No replies yet.</p>
      )
    }
  }

  return (
    <div className='container pt-4 pb-4'>
      <h1 className='title'>{post.title}</h1>
      <div className='box has-background-light has-text-black p-3'>
        <p><strong>{getDisplayName(post.UserId, group.members)}</strong> <small>{dayjs().to(dayjs(post.createdAt))}</small></p>
        <p>{post.text}</p>
      </div>
      <br />
      <h1 className='title is-4'>Replies</h1>
      {displayReplies()}
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
    </div>
  );
}

export default PostView