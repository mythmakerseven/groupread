import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../../reducers/groupReducer'
import PostDisplay from './PostDisplay'
import PostForm from './PostForm'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import {
  ErrorTypes,
  Post
} from '../../types'

import { PostPayloadType } from './PostForm'
import ErrorPage from '../ErrorPage'

const PostView: React.FC = () => {
  const dispatch = useAppDispatch()
  const { id, pid } = useParams<({ id: string, pid: string })>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
  const groups = useAppSelector(({ group }) => group.groups)
  const group = groups.find(group => group.id === id)

  if (!user) {
    return (
      <ErrorPage errorType={ErrorTypes.Unauthorized} />
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

  const displayReplies = () => {
    // Check if there are any replies first
    if (post.replies && post.replies.length > 0) {
      return post.replies.map(reply =>
        <PostDisplay key={reply.id} groupMembers={group.members} postObject={reply} />
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
      <PostDisplay
        groupMembers={group.members}
        postObject={post}
      />
      <br />
      <h1 className='title is-4'>Replies</h1>
      {displayReplies()}
      <h1 className='subtitle'>Reply</h1>
      <PostForm
        payloadType={PostPayloadType.New}
        startingText={null}
        replyID={null}
        setActive={null}
      />
    </div>
  )
}

export default PostView