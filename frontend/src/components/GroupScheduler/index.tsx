import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useParams } from 'react-router-dom'
import { getGroupDetails } from '../../reducers/groupReducer'
import WeekNumberForm from './WeekNumberForm'

const GroupScheduler: React.FC = () => {
  const dispatch = useAppDispatch()

  const { id } = useParams<({ id: string })>()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  const groups = useAppSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)
  const user = useAppSelector(({ user }) => user)

  if (!group) {
    return <p>Group not found</p>
  }

  if (!user) {
    return <p>Invalid user ID</p>
  }

  const suggestWeeklyAmount = (pageCount: number) => {
    if (pageCount <= 500) {
      const weeklyPagesSuggestion = Math.floor(pageCount / 4)
      return ({
        weeks: 4,
        weeklyPages: weeklyPagesSuggestion,
        remainder: pageCount % 4
      })
    } else {
      const weeklyPagesSuggestion = Math.floor(pageCount / 8)
      return ({
        weeks: 8,
        weeklyPages: weeklyPagesSuggestion,
        remainder: pageCount % 8
      })
    }
  }

  return (
    <div className='container pt-4 pb-4'>
      <h1 className='title'>Schedule</h1>
      <div className='card mt-4 mb-4'>
        <div className='card-content'>
          <p className='content is-size-5'>It looks like <span className='has-text-primary'>{group.bookTitle}</span> has {group.bookPageCount} pages.</p>
          <p>We recommend the schedule listed below.</p>
          <p className='content is-size-6'>You can adjust the number of weeks and the page goal for each week below.</p>
        </div>
      </div>
      <WeekNumberForm initialWeeks={suggestWeeklyAmount(group.bookPageCount).weeks} pageCount={group.bookPageCount} />
    </div>
  )
}

export default GroupScheduler