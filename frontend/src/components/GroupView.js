import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'
import { joinGroup } from '../reducers/groupReducer'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const GroupView = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector(({ user }) => user)
  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  // TODO: Refactor so it doesn't request the list of members if the user is not a member
  // This will likely require significant rewriting, as the component relies on the list of
  // members returned from the server to decide what to show. The best course of action
  // seems to be adding a group membership list to the user object returned by the backend
  // and checking against that instead of the group's list.
  const members = group ? group.members : null
  const posts = group ? group.posts : null
  const memberIDs = members ? group.members.map(m => m.id) : []

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  useEffect(() => {
    if (!user || !memberIDs.includes(user.id)) {
      return null
    } else {
      dispatch(getGroupPosts(id))
    }
  }, [id, user, members])

  if (!group) return null

  // filter the list of all posts to return only parent-level posts
  const getParentPosts = posts => {
    return posts.filter(p => !p.parent)
  }

  if (group.id !== id || !members) {
    return <p>loading...</p>
  }

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
        <p>No posts yet.</p>
      )
    default:
      return posts.map(p => displayPost(p))
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
      <>
        <p className='title is-5'>You&apos;ve been invited to join.</p>
      </>
    )

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

  // TODO: Button for leaving the group? Would require significant refactor, not sure if it's needed that badly.

  const handlePostButton = () => {
    if (!user) return null

    if (!memberIDs.includes(user.id)) return null

    return (
      <button className='button is-primary level-item' onClick={() => history.push(`/groups/${group.id}/submit`)}>
          New Post
      </button>
    )
  }

  const resolveUsername = id => {
    const userToShow = group.members.find(m => m.id === id)
    if (!userToShow) return <span className='has-text-warning'>username not found</span>
    return userToShow.displayName
  }

  const displayPost = post => (
    <Link key={post.id} to={`/groups/${group.id}/${post.id}`}>
      <div className='card mt-4 mb-4'>
        <div className='card-content'>
          <div className='content'>
            <article className='media'>
              <div className='media-content'>
                <div className='content'>
                  <p>
                    <strong className='has-text-primary is-size-5'>{post.title}</strong>
                    <br />
                    <strong>{truncate(post.text)}</strong>
                    <br />
                    posted {dayjs().to(dayjs(post.createdAt))} by <strong>{resolveUsername(post.UserId)}</strong> &#183; {post.replies.length} replies
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Link>
  )

  const displayNonMemberHero = () => {
    if (user && memberIDs.includes(user.id)) return null

    return (
      <div className='hero has-text-centered is-primary mb-4'>
        <div className='hero-body'>
          <h1 className='title'>{displayMembers(members)}</h1>
          {handleJoinButton(user ? user.id : null)}
        </div>
      </div>
    )
  }

  const handleLoggedInContent = () => {
    if (!user || !memberIDs.includes(user.id)) {
      return null
    }

    return (
      <>
        <div className='level is-mobile'>
          <div className='level-left'>
            <h1 className='title level-item'>Posts</h1>
          </div>
          <div className='level-right'>
            {handlePostButton()}
          </div>
        </div>
        {posts ? handlePosts(getParentPosts(posts)) : null}
      </>
    )
  }

  // eventually there should be alternate cover sources for books without an OLID
  const handleBookImage = olid => {
    if (!olid) {
      return null
    } else {
      return (
        <img className='image is-inline-block' src={`https://covers.openlibrary.org/b/olid/${olid}-M.jpg`} />
      )
    }
  }

  const handleJoinDate = user => {
    if (user.UserGroups) {
      return (
        <span> - joined {dayjs().to(dayjs(user.UserGroups.createdAt))}</span>
      )
    }
    return null
  }

  const displayGroupMembers = () => (
    <>
      <h1 className='title'>Members</h1>
      <div className='box'>
        {members.map(m => (
          <p key={m.id}><strong>{m.displayName}</strong> {group.AdminId === m.id ? <span className='has-text-danger'>(admin)</span> : null}
            {handleJoinDate(m)}
          </p>
        ))}
      </div>
    </>
  )

  console.log(members)

  return (
    <div>
      {displayNonMemberHero()}
      <div className='box has-text-centered'>
        {handleBookImage(group.bookOLID)}
        <h1 className='title'>{group.bookTitle}</h1>
        <h1 className='subtitle' as='h3'>by {group.bookAuthor}</h1>
        <h4>Hosted by {resolveUsername(group.AdminId)}</h4>
      </div>
      {handleLoggedInContent()}
      {displayGroupMembers()}
    </div>
  )
}

export default GroupView
