import React, { useEffect, useState } from 'react'
import { getGroupPosts } from '../../reducers/groupReducer'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { getDisplayName } from '../../utils/posts'
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

    return posts.map(p => displayPost(p))
  }

  const truncate = (text: string) => {
    return (text.length > 80)
      ? `${text.substring(0, 80)}...`
      : text
  }

  const displayPost = (post: Post) => (
    <Link key={post.id} to={`/groups/${groupID}/${post.id}`}>
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
                    posted {dayjs().to(dayjs(post.createdAt))} by <strong>{getDisplayName(post.UserId, groupMembers)}</strong> &#183; {post.replies ? post.replies.length : 0} replies
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div>
      {posts ? handlePosts(posts) : null}
    </div>
  )
}

export default PostList