import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupPosts } from '../reducers/groupReducer'

const PostView = () => {
  const dispatch = useDispatch()
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

  return (
    <div>
      <h1 className='title'>{post.title}</h1>
      <p>{post.text}</p>
    </div>
  )
}

export default PostView