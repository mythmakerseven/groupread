import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'

const GroupView = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  // not great to do two queries for each load....
  // or is it???
  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupPosts(id))
  }, [id])

  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  if (!group) return null

  const members = group.members
  const posts = group.posts

  if (group.id !== id || !members || !posts) {
    return <p>loading...</p>
  }

  return (
    <div>
      <h1>{group.groupName}</h1>
      <h4>Members:</h4>
      {members.map(member => <span key={member.id}>{member.displayName} </span>)}
      <span>are reading {group.bookName}</span>
      <h4>Posts:</h4>
      {posts.map(post => <p key={post.id}>{post.text}</p>)}
    </div>
  )
}

export default GroupView