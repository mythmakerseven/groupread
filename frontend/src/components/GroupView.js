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

  const displayMembers = members => {
    switch(members.length) {
    case 0:
      return <p>No one is reading {group.bookName} :(</p>
    case 1:
      return <p>{members[0].displayName} is reading {group.bookName} alone. Give them some company!</p>
    case 2:
      return <p>{members[0].displayName} and {members[1].displayName} are reading {group.bookName}.</p>
    default:
      return members.map(member => {
        if (members.indexOf(member) === (members.length - 1)) {
          return <span key={member.id}>and {member.displayName} are reading {group.bookName}.</span>
        } else {
          return <span key={member.id}>{member.displayName}, </span>
        }
      })
    }
  }

  // I <3 recursion
  // This function should still work if support for infinitely nested comments is added
  const displayPosts = posts => {
    return posts.map(post => {
      if (post.replies) {
        return (
          <div key={post.id}>
            <li>{post.text}</li>
            <ol>
              {displayPosts(post.replies)}
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
      <h1>{group.groupName}</h1>
      <h4>Members:</h4>
      {displayMembers(members)}
      <h4>Posts:</h4>
      <ol>
        {displayPosts(posts)}
      </ol>
    </div>
  )
}

export default GroupView
