import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { parseMarkdown, getDisplayName } from '../../lib/posts'
dayjs.extend(relativeTime)
import { Post, User } from '../../types'
import { useAppSelector } from '../../hooks'
import ReplyForm from './PostForm'
import { PostPayloadType } from './PostForm'

interface Props {
  groupMembers: Array<User>,
  postObject: Post
}

const Reply: React.FC<Props> = ({ groupMembers, postObject }) => {
  // Remark is async, so we have to do some state management
  // to wait for it to do its thing
  const [text, setText] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const user = useAppSelector(({ user }) => user)

  // Call the remark function on component load
  // Also re-run it if replyObject changes (e.g.
  // when the post is edited)
  useEffect(() => {
    const getHTML = async (postContent: string) => {
      const formattedText = await parseMarkdown(postContent)
      setText(formattedText)
    }

    getHTML(postObject.text)
  }, [postObject])


  if (!user) return <p>Loading...</p>

  const handleEditButton = (authorID: string) => {
    if (authorID === user.id) {
      return (
        <button
          className='button is-small'
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      )
    } else {
      return null
    }
  }

  const handleEditing = () => {
    if (isEditing) {
      return (
        <ReplyForm
          payloadType={PostPayloadType.Edit}
          startingText={postObject.text}
          replyID={postObject.id}
          setActive={setIsEditing}
        />
      )
    } else {
      return <div className='post-typography' dangerouslySetInnerHTML={{ __html: text }} />
    }
  }

  return (
    <div key={postObject.id} className='box box-with-border has-background-light has-text-black p-4'>
      <div className='content'>
        <p>
          <strong>{getDisplayName(postObject.UserId, groupMembers)}</strong>
          &nbsp;&nbsp;
          <small>{dayjs().to(dayjs(postObject.createdAt))}</small>
          &nbsp;&nbsp;
          {handleEditButton(postObject.UserId)}
        </p>
        {handleEditing()}
      </div>
    </div>
  )
}

export default Reply