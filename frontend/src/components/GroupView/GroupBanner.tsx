import React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { joinGroup } from '../../reducers/groupReducer'
import { getDisplayName } from '../../lib/posts'
import BookCover from '../common/BookCover'
import { CoverSize } from '../common/BookCover'
import {
  Group,
  User
} from '../../types'

interface Props {
  group: Group
}

const GroupBanner: React.FC<Props> = ({ group }) => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(({ user }) => user.data)

  const handleGroupMembership = (id: string, token: string) => {
    dispatch(joinGroup({
      id: id,
      token: token
    }))
  }

  if (!group || !group.members) {
    return null
  }

  const memberIDs = group.members.map(m => m.id)

  const displayMembers = (members: Array<User>) => {
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

  const handleJoinButton = (userID: string | null) => {
    if (!user || !userID) return (
      <>
        <p className='title is-5'>You&apos;ve been invited to join.</p>
        <p className='subtitle'>After joining, you&apos;ll have access to this group&apos;s private discussions.</p>
      </>
    )

    if (user && !memberIDs.includes(userID)) {
      return (
        <>
          <p className='title is-5'>You&apos;ve been invited to join.</p>
          <p className='subtitle'>After joining, you&apos;ll have access to this group&apos;s private discussions.</p>
          <button className='button is-link' type='button' onClick={() => handleGroupMembership(group.id, user.token)}>
            Join
          </button>
        </>
      )
    } else {
      return null
    }
  }

  const displayNonMemberHero = () => {
    if (user && memberIDs.includes(user.id)) return null

    return (
      <div className='box hero has-text-centered is-primary mb-4'>
        <div className='hero-body'>
          <h1 className='title'>{displayMembers(group.members)}</h1>
          {handleJoinButton(user ? user.id : null)}
        </div>
      </div>
    )
  }

  return (
    <>
      {displayNonMemberHero()}
      <div className='box has-text-centered group-hero'>
        <BookCover
          size={CoverSize.Medium}
          olid={group.bookOLID}
        />
        <h1 className='title'>{group.bookTitle}</h1>
        <h1 className='subtitle'>by {group.bookAuthor}</h1>
        {/* TODO: add admin info to group object from server so we can finally dump this helper function */}
        <h4>Hosted by {getDisplayName(group.AdminId, group.members)}</h4>
      </div>
    </>
  )
}

export default GroupBanner