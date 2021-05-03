import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'
import { joinGroup } from '../reducers/groupReducer'
import { getDisplayName } from '../utils/posts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Group,
  UserObject,
  Post,
  User
} from '../types'
dayjs.extend(relativeTime)
import unknownCover from '../images/unknown_cover.webp'

const GroupView = () => {
  const { id } = useParams<{ id: string }>()

  const dispatch = useAppDispatch()
  const history = useHistory()

  const user: UserObject | null = useAppSelector(({ user }) => user)
  const groups: Array<Group> = useAppSelector(({ group }) => group)

  // See if the group exists
  const groupResponse: undefined | Group = groups.find(group => group.id === id)

  // Set these up so they can be filled in later if applicable
  let members: Array<User> = []
  let posts: Array<Post> = []
  let memberIDs: Array<string> = []

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  useEffect(() => {
    if (user && memberIDs.includes(user.id)) {
      dispatch(getGroupPosts(id))
    }
  }, [id, user, members])

  // Now we can have a properly typed group object with
  // the possibility of being undefined out of the way
  let group: Group
  if (!groupResponse) {
    return <p>Group not found</p>
  }
  group = groupResponse

  // Fill in the members list
  members = group.members
  memberIDs = members ? members.map(m => m.id) : []

  // Fill in the posts list
  if (user && memberIDs.includes(user.id) && group.posts) {
    posts = group.posts
  }

  // Filter the list of all posts to return only parent-level posts
  const getParentPosts = (posts: Array<Post>): Array<
  Post> => {
    return posts.filter(p => !p.parent)
  }

  if (group.id !== id || !members) {
    return <p>loading...</p>
  }

  const displayMembers = (members: Array<User> | null) => {
    if (!members) return null
    switch(members.length) {
    case 0:
      return <p>No one is reading {group.bookTitle} :(</p>
    case 1:
      return <p>{members[0].displayName} is reading <em>{group.bookTitle}</em>.</p>
    case 2:
      return <p>{members[0].displayName} and {members[1].displayName} are reading <em>{group.bookTitle}</em>.</p>
    case 3:
      return <p>{members[0].displayName}, {members[1].displayName}, and {members[2].displayName} are reading <em>{group.bookTitle}</em></p>
    default:
      return <p>{members[0].displayName}, {members[1].displayName}, and {members.length - 2} others are reading <em>{group.bookTitle}</em></p>
    }
  }

  const handlePosts = (posts: Array<Post>) => {
    if (posts.length === 0) {
      return (
        <p>No posts yet.</p>
      )
    }

    return posts.map(p => displayPost(p))
  }

  const truncate = (text: string) => {
    return (text.length > 80)
      ? `${text.substring(0, 80)}...`
      : text
  }

  const handleGroupMembership = (id: string, token: string) => {
    dispatch(joinGroup({
      id: id,
      token: token
    }))
  }

  const handleJoinButton = (userID: string | null) => {
    if (!user || !userID) return (
      <>
        <p className='title is-5'>You&apos;ve been invited to join.</p>
        <p className='subtitle'>After joining, you&apos;ll have access to this group&apos;s private discussions.</p>
      </>
    )

    if (!memberIDs.includes(userID)) {
      return (
        <>
          <p className='title is-5'>You&apos;ve been invited to join.</p>
          <p className='subtitle'>After joining, you&apos;ll have access to this group&apos;s private discussions.</p>
          <button className='button is-link' type='button' onClick={() => handleGroupMembership(id, user.token)}>
            Join
          </button>
        </>
      )
    } else {
      return null
    }
  }

  const handlePostButton = () => {
    if (!user) return null

    if (!memberIDs.includes(user.id)) return null

    return (
      <button className='button is-primary level-item' onClick={() => history.push(`/groups/${group.id}/submit`)}>
          New Post
      </button>
    )
  }

  const displayPost = (post: Post) => (
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
                    posted {dayjs().to(dayjs(post.createdAt))} by <strong>{getDisplayName(post.UserId, group.members)}</strong> &#183; {post.replies ? post.replies.length : 0} replies
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
      <div className='box hero has-text-centered is-primary mb-4'>
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
  const handleBookImage = (olid: string) => {
    if (!olid) {
      return <img className='image cover-image is-inline-block' src={unknownCover} />
    } else {
      return (
        <img className='image cover-image is-inline-block' src={`https://covers.openlibrary.org/b/olid/${olid}-M.jpg`} />
      )
    }
  }

  const displayGroupMembers = () => (
    <>
      <h1 className='title'>Members</h1>
      <div className='box'>
        {members.map(m => (
          <p key={m.id}><strong>{m.displayName}</strong> {group.AdminId === m.id ? <span className='has-text-danger'>(admin)</span> : null}
             - joined {dayjs().to(dayjs(m.UserGroups.createdAt))}
          </p>
        ))}
      </div>
    </>
  )

  return (
    <div className='container pt-4 pb-4'>
      {displayNonMemberHero()}
      <div className='box has-text-centered group-hero'>
        {handleBookImage(group.bookOLID)}
        <h1 className='title'>{group.bookTitle}</h1>
        <h1 className='subtitle'>by {group.bookAuthor}</h1>
        <h4>Hosted by {getDisplayName(group.AdminId, group.members)}</h4>
      </div>
      {handleLoggedInContent()}
      {displayGroupMembers()}
    </div>
  )
}

export default GroupView
