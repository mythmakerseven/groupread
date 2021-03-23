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
    <div className='container pt-4 pb-4'>
      <h1 className='title' textalign='center'>
        Groups
      </h1>
      <div className='columns is-centered'>
        <div className='column is-5'>
          {groups.map(group =>
            <Link key={group.id} to={`/groups/${group.id}`}>
              <div  className='box mt-4 mb-4'>
                <div className='list-item has-text-centered'>
                  <p className='is-size-5 has-text-primary'>
                    <strong>{group.bookTitle}</strong> by {group.bookAuthor}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupList