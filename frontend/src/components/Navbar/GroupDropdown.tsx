import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getPersonalInfo } from '../../reducers/userReducer'
import Dropdown from '../common/Dropdown'

const GroupDropdown: React.FC = () => {
  const user = useAppSelector(({ user }) => user)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user) {
      dispatch(getPersonalInfo({ id: user.id, token: user.token }))
    }
  }, [user?.id])

  if (!user || !user.Groups) {
    return null
  }

  return (
    <Dropdown
      label={'My Groups'}
      content={user.Groups.map(g => <p key={g.id}><Link to={`/groups/${g.id}`}>{g.bookTitle}</Link></p>)}
    />
  )
}

export default GroupDropdown