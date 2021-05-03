import React, { useEffect, useState } from 'react'
import { getGroupPosts } from '../../reducers/groupReducer'
import { useAppDispatch, useAppSelector } from '../../hooks'
import PostCard from './PostCard'
import {
  Post,
  UserObject,
  User,
  Group
} from '../../types'

interface Props {
  groupID: string,
  groupMembers: Array<User>
}

const PostList: React.FC<Props> = ({ groupID, groupMembers }) => {
  const [posts, setPosts] = useState<Array<Post>>([])

  const dispatch = useAppDispatch()

  const user: UserObject | null = useAppSelector(({ user }) => user)

  const groups: Array<Group> = useAppSelector(({ group }) => group)
  const groupQuery: undefined | Group = groups.find(group => group.id === groupID)

  if (!groupQuery) {
    return <p>Invalid group ID</p>
  }

  const group = groupQuery

  useEffect(() => {
    if (user) {
      dispatch(getGroupPosts(groupID))
    }
  }, [user])

  useEffect(() => {
    setPosts(group.posts)
  }, [group])

  const getParentPosts = (posts: Array<Post>): Array<Post> => {
    return posts.filter(p => !p.parent)
  }

  const handlePosts = (posts: Array<Post>) => {
    if (posts.length === 0) {
      return (
        <p>No posts yet.</p>
      )
    }

    return posts.map(p => <PostCard key={p.id} groupID={groupID} post={p} groupMembers={groupMembers} />)
  }

  return (
    <div>
      {posts ? handlePosts(posts) : null}
    </div>
  )
}

export default PostList