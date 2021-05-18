import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'
import Reply from './Posts/Reply'
import ReplyForm from './Posts/ReplyForm'
import { getDisplayName } from '../lib/posts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import {
  Post
} from '../types'

import { ReplyPayloadType } from './Posts/ReplyForm'

const PostView: React.FC = () => {
  const dispatch = useAppDispatch()
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
      <div className='box box-with-border has-background-light has-text-black p-4'>
        <p><strong>{getDisplayName(post.UserId, group.members)}</strong> <small>{dayjs().to(dayjs(post.createdAt))}</small></p>
        <p>{post.text}</p>
      </div>
      <br />
      <h1 className='title is-4'>Replies</h1>
      {displayReplies()}
      <h1 className='subtitle'>Reply</h1>
      <ReplyForm
        payloadType={ReplyPayloadType.New}
        startingText={null}
        replyID={null}
        setActive={null}
      />
    </div>
  );
}

export default PostView