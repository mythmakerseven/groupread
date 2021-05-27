import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useParams, useHistory } from 'react-router-dom'
import { getGroupDetails, getGroupMembers } from '../../reducers/groupReducer'
import GroupBanner from './GroupBanner'
import PostList from '../Posts/PostList'
import MembersList from './MembersList'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Group,
  UserObject,
  User
} from '../../types'

const GroupView: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const dispatch = useAppDispatch()
  const history = useHistory()

  const user: UserObject | null = useAppSelector(({ user }) => user)
  const groups: Array<Group> = useAppSelector(({ group }) => group)

  // See if the group exists in the cache
  const groupQuery: undefined | Group = groups.find(group => group.id === id)

  // Set these up so they can be filled in later if applicable
  let members: Array<User> = []
  let memberIDs: Array<string> = []

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  // Now we can have a properly typed group object with
  // the possibility of being undefined out of the way
  if (!groupQuery) {
    return <p>Group not found</p>
  }
  const group: Group = groupQuery

  // Fill in the members list
  members = group.members ? group.members : []
  memberIDs = members.map(m => m.id)

  if (group.id !== id || !members) {
    return <p>loading...</p>
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
        <PostList groupID={id} groupMembers={members}/>
      </>
    )
  }

  const handleBanner = () => {
    if (group) {
      return <GroupBanner group={group} />
    }
  }

  return (
    <div className='container pt-4 pb-4'>
      {handleBanner()}
      {handleLoggedInContent()}
      <MembersList adminID={group.AdminId} groupMembers={members} />
    </div>
  )
}

export default GroupView
