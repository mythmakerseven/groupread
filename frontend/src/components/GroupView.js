import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'
import { joinGroup } from '../reducers/groupReducer'

const GroupView = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupPosts(id))
  }, [id])

  const user = useSelector(({ user }) => user)
  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  if (!group) return null

  const members = group.members
  const posts = group.posts

  const getParentPosts = posts => {
    return posts.filter(p => !p.parent)
  }

  if (group.id !== id || !members || !posts) {
    return <p>loading...</p>
  }

  const parentPosts = getParentPosts(posts)

  const displayMembers = members => {
    switch(members.length) {
    case 0:
      return <p>No one is reading {group.bookTitle} :(</p>
    case 1:
      return <p>{members[0].displayName} is reading {group.bookTitle} alone. Give them some company!</p>
    case 2:
      return <p>{members[0].displayName} and {members[1].displayName} are reading {group.bookTitle}.</p>
    default:
      return members.map(member => {
        if (members.indexOf(member) === (members.length - 1)) {
          return <span key={member.id}>and {member.displayName} are reading {group.bookTitle}.</span>
        } else {
          return <span key={member.id}>{member.displayName}, </span>
        }
      })
    }
  }

  const handlePosts = posts => {
    switch (posts.length) {
    case 0:
      return (
        <tr>
          <th>No posts yet.</th>
        </tr>
      )
    default:
      return displayPosts(posts)
    }
  }

  const truncate = text => {
    return (text.length > 64)
      ? `${text.substring(0, 64)}...`
      : text
  }

  const handleGroupMembership = (id, token) => {
    dispatch(joinGroup(id, token))
  }

  const handleJoinButton = userID => {
    if (!user) return null

    const memberIDs = group.members.map(m => m.id)
    if (!memberIDs.includes(userID)) {
      return (
        <button className='button is-primary' type='button' onClick={() => handleGroupMembership(id, user.token)}>
          Join
        </button>
      )
    } else {
      return <p>You are a member of this group</p>
    }
  }

  const displayPosts = posts => {
    return posts.map(post => {
      return (
        <tr key={post.id}>
          <th><Link to={`/groups/${group.id}/${post.id}`}>{post.title}</Link></th>
          <th>{truncate(post.text)}</th>
          <th>{post.createdAt.substring(5,10)}</th>
        </tr>
      )
    })
  }

  return (
    <div>
      <h1 className='title'>{displayMembers(members)}</h1>
      <h1 className='title'>{group.bookTitle}</h1>
      <h1 className='subtitle' as='h3'>by {group.bookAuthor}</h1>
      {handleJoinButton(user ? user.id : null)}
      <img className='image' src={`https://covers.openlibrary.org/b/olid/${group.bookOLID}-M.jpg`} />
      <div>
      </div>
      <h1 className='title'>Posts</h1>
      <button className='button is-primary' onClick={() => history.push(`/groups/${group.id}/submit`)}>
          New Post
      </button>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Text</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {handlePosts(parentPosts)}
        </tbody>
      </table>
      <p>book metadata provided by the <a href="https://openlibrary.org/" target="_blank" rel="noreferrer">Open Library API</a></p>
    </div>
  )
}

export default GroupView
