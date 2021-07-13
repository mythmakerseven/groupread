import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getPersonalInfo } from '../../reducers/userReducer'
import Dropdown from '../common/Dropdown'

const GroupDropdown: React.FC = () => {
  const user = useAppSelector(({ user }) => user.data)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user) {
      dispatch(getPersonalInfo({ id: user.id, token: user.token }))
    }
  }, [user?.id])

  if (!user || !user.Groups) {
    return null
  }

  const dropdownContent = (): JSX.Element => {
    if (user.Groups.length === 0) {
      return (
        <p className='has-text-centered'>Nothing here yet. <Link to='/groups'>Go join some groups!</Link></p>
      )
    } else {
      return (
        <ul>
          {user.Groups.map(g =>
            <Link to={`/groups/${g.id}`} key={g.id}>
              <li className='dropdown-group-item' >
                <img src={`https://covers.openlibrary.org/b/olid/${g.bookOLID}-S.jpg`} alt='' />
                {g.bookTitle}
              </li>
            </Link>
          )}
        </ul>
      )
    }
  }

  return (
    <Dropdown
      label={'My Groups'}
      content={dropdownContent()}
    />
  )
}

export default GroupDropdown