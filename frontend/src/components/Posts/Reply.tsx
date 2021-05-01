import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { parseMarkdown } from '../../utils/posts'
import { getDisplayName } from '../../utils/posts'
dayjs.extend(relativeTime)

interface Props {
  groupMembers: Array<any>,
  replyObject: Object
}

const Reply: React.FC<Props> = ({ groupMembers, replyObject }) => {
  // Remark is async, so we have to do some state management
  // to wait for it to do its thing
  const [text, setText] = useState(null)

  // Call the remark function on component load
  useEffect(() => {
    const getHTML = async (text) => {
      const formattedText = await parseMarkdown(text)
      setText(formattedText)
    }

    getHTML(replyObject.text)
  }, [])

  return (
    <div key={replyObject.id} className='box has-background-light has-text-black p-3'>
    <div className='content'>
      <p><strong>{getDisplayName(replyObject.UserId, groupMembers)}</strong> <small>{dayjs().to(dayjs(replyObject.createdAt))}</small></p>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </div>
  )
}

export default Reply