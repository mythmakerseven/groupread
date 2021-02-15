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
          {groups.map(group =>
            <Link key={group.id} to={`/groups/${group.id}`}>
              <div  className='box mt-4 mb-4'>
                <div className='list-item has-text-centered'>
                  <strong className='is-size-4 has-text-primary'>{group.bookTitle} by {group.bookAuthor}</strong>
                  <br />
                  (id: {group.id})
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