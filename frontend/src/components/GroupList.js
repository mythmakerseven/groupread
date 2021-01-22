import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllGroups } from '../reducers/groupListReducer'
import { Link } from 'react-router-dom'

const GroupList = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllGroups())
  }, [dispatch])

  const groups = useSelector(({ groupList }) => groupList)

  return (
    <div>
      <h1 className='title' textalign='center'>
        Group Read
      </h1>
      <p>Note: This list is temporary for development purposes. 1.0 will not have a public list of groups.</p>
      <ul>
        {groups.map(group =>
          <li key={group.id}>
            <Link to={`/groups/${group.id}`}>
              {group.id} - {group.bookTitle}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default GroupList