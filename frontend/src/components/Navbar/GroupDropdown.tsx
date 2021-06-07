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

  const dropdownContent = (): JSX.Element => (
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

  return (
    <Dropdown
      label={'My Groups'}
      content={dropdownContent()}
    />
  )
}

export default GroupDropdown