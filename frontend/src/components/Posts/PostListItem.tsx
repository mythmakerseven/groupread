import React from 'react'
import { Link } from 'react-router-dom'
import { truncate } from '../../lib/posts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import {
  Post
} from '../../types'

interface Props {
  groupID: string,
  post: Post
}

const PostCard: React.FC<Props> = ({ groupID, post }) => (
  <Link className='hoverable-item' key={post.id} to={`/groups/${groupID}/${post.id}`}>
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
                  posted {dayjs().to(dayjs(post.createdAt))} by <strong>{post.User.displayName}</strong> &#183; {post.replies ? post.replies.length : 0} replies
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </Link>
)

export default PostCard