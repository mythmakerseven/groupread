import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getGroupDetails, getGroupMembers, getGroupPosts } from '../reducers/groupReducer'

const GroupView = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  // not great to do multiple queries for each load....
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

  // TODO: move below function to the post view component when it's made

  // I <3 recursion
  // This function should still work if support for infinitely nested comments is added
  // const displayPosts = posts => {
  //   return posts.map(post => {
  //     if (post.replies) {
  //       return (
  //         <div key={post.id}>
  //           <li>{post.text}</li>
  //           <ol>
  //             {displayPosts(post.replies)}
  //           </ol>
  //         </div>
  //       )
  //     } else {
  //       return <li key={post.id}>{post.text}</li>
  //     }
  //   })
  // }

  const truncate = text => {
    return (text.length > 64)
      ? `${text.substring(0, 64)}...`
      : text
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
      <div className='columns is-multiline -is-mobile'>
        <div className='column is-one-quarter'>
          <img className='image is-square' src={`https://covers.openlibrary.org/b/olid/${group.bookOLID}-M.jpg`} />
        </div>
      </div>
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
