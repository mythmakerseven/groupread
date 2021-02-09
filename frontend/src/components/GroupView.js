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
      return <p>{members[0].displayName} is reading {group.bookTitle}.</p>
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
    return (text.length > 80)
      ? `${text.substring(0, 80)}...`
      : text
  }

  const handleGroupMembership = (id, token) => {
    dispatch(joinGroup(id, token))
  }

  const handleJoinButton = userID => {
    if (!user) return (
      <p className='title is-5'>You&apos;ve been invited to join.</p>
    )

    const memberIDs = group.members.map(m => m.id)
    if (!memberIDs.includes(userID)) {
      return (
        <>
          <p className='title is-5'>You&apos;ve been invited to join.</p>
          <button className='button is-success' type='button' onClick={() => handleGroupMembership(id, user.token)}>
            Join
          </button>
        </>
      )
    } else {
      return null
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

  const handlePostButton = () => {
    if (!user) return null

    const memberIDs = group.members.map(m => m.id)
    if (!memberIDs.includes(user.id)) return null

    return (
      <button className='button is-primary level-item' onClick={() => history.push(`/groups/${group.id}/submit`)}>
          New Post
      </button>
    )
  }

  return (
    <div>
      <div className='hero has-text-centered is-primary'>
        <div className='hero-body'>
          <h1 className='title'>{displayMembers(members)}</h1>
          {handleJoinButton(user ? user.id : null)}
        </div>
      </div>
      <div className='box has-text-centered'>
        <img className='image is-inline-block' src={`https://covers.openlibrary.org/b/olid/${group.bookOLID}-M.jpg`} />
        <h1 className='title'>{group.bookTitle}</h1>
        <h1 className='subtitle' as='h3'>by {group.bookAuthor}</h1>
      </div>
      <div className='level is-mobile'>
        <div className='level-left'>
          <h1 className='title level-item'>Posts</h1>
        </div>
        <div className='level-right'>
          {handlePostButton()}
        </div>
      </div>
      <table className='table container'>
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
      <div className='has-text-centered'>
        <p>[ Schedule link for development purposes: <Link to={`/groups/${group.id}/schedule`}>Schedule</Link> ]</p>
      </div>
    </div>
  )
}

export default GroupView
