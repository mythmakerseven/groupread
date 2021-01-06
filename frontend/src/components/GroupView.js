import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getGroupDetails, getGroupMembers } from '../reducers/groupReducer'

const GroupView = () => {
  const { id } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  // not great to do two queries for each load....
  useEffect(() => {
    dispatch(getGroupMembers(id))
  }, [id])

  const group = useSelector(({ group }) => group)

  if (!group) return null

  const members = group.members

  if (group.id !== id || !members) {
    return <p>loading...</p>
  }

  return (
    <div>
      <h1>{group.groupName}</h1>
      <h4>Members:</h4>
      {members.map(member => <p key={member.id}>{member.displayName}</p>)}
    </div>
  )
}

export default GroupView