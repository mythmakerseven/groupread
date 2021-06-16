import React, { useEffect, useState } from 'react'
import { getGroupPosts } from '../../reducers/groupReducer'
import { useAppDispatch, useAppSelector } from '../../hooks'
import PostCard from './PostListItem'
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

  const groups: Array<Group> = useAppSelector(({ group }) => group.groups)
  const groupQuery: undefined | Group = groups.find(group => group.id === groupID)

  if (!groupQuery) {
    return <p>Invalid group ID</p>
  }

  const group = groupQuery

  // Make sure nothing comes up when the user isn't signed in
  useEffect(() => {
    if (user) {
      dispatch(getGroupPosts(groupID))
    }
  }, [user])

  // There won't be posts on the first load if the group isn't cached,
  // so run setPosts again when the group data is in state
  useEffect(() => {
    setPosts(group.posts)
  }, [group])

  const handlePosts = (posts: Array<Post>) => {
    if (posts.length === 0) {
      return (
        <p>No posts yet.</p>
      )
    }

    const parentPosts = posts.filter(p => !p.parent)

    return parentPosts.map(p => <PostCard
      key={p.id}
      groupID={groupID}
      post={p}
      groupMembers={groupMembers}
    />)
  }

  return (
    <div>
      {posts ? handlePosts(posts) : null}
    </div>
  )
}

export default PostList