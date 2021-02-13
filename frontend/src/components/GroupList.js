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
      <p>Note: This list is temporary for development purposes. Version 1.0 will not have a public list of groups.</p>
      <div className='columns is-centered'>
        <div className='column is-5'>
          <div className='list mt-4'>
            <ul>
              {groups.map(group =>
                <div key={group.id} className='list-item'>
                  <li className='has-text-centered mt-3 mb-3'>
                    <Link to={`/groups/${group.id}`}>
                      <strong className='is-size-4'>{group.bookTitle} by {group.bookAuthor}</strong>
                      <br />
                      (id: {group.id})
                    </Link>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupList