import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import {
  User
} from '../../types'

interface Props {
  adminID: string,
  groupMembers: Array<User>
}

const MembersList: React.FC<Props> = ({ adminID, groupMembers }) => {
  return (
    <>
    <h1 className='title'>Members</h1>
    <div className='box'>
      {groupMembers.map((m: User) => (
        <p key={m.id}><strong>{m.displayName}</strong> {adminID === m.id ? <span className='has-text-danger'>(admin)</span> : null}
           - joined {dayjs().to(dayjs(m.UserGroups.createdAt))}
        </p>
      ))}
    </div>
  </>
  )
}

export default MembersList