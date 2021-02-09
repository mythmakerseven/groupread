import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useParams } from 'react-router-dom'
import { getGroupDetails } from '../reducers/groupReducer'

const GroupScheduler = () => {
  const [weeks, setWeeks] = useState(1)
  const dispatch = useDispatch()
  const { register, handleSubmit, setValue, watch, errors } = useForm()

  const watchWeeks = watch('weeks')

  const { id } = useParams()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  const suggestWeeklyAmount = pageCount => {
    if (pageCount <= 500) {
      const weeklyPagesSuggestion = parseInt(group.bookPageCount / 4)
      return ({
        recommendedWeeks: 4,
        weeklyPages: weeklyPagesSuggestion,
        remainder: pageCount - (weeklyPagesSuggestion * 3)
      })
    } else {
      const weeklyPagesSuggestion = parseInt(group.bookPageCount / 8)
      return ({
        recommendedWeeks: 8,
        weeklyPages: weeklyPagesSuggestion,
        remainder: pageCount - (weeklyPagesSuggestion * 7)
      })
    }
  }

  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  const fillOutWeekValues = (weekCount, pagesPerWeek) => {
    const handlePages = i => {
      if (i === weekCount) {
        return group.bookPageCount
      }
      return i * pagesPerWeek
    }

    // cycle through each week input
    for (let i = 1; i <= weekCount; i++) {
      setValue(`week${i}`, handlePages(i))
    }
  }

  // set initial week counts
  useEffect(() => {
    if (!group) return null
    const initialObject = suggestWeeklyAmount(group.bookPageCount)
    const initialWeeks = initialObject.recommendedWeeks
    setWeeks(parseInt(initialWeeks))
    fillOutWeekValues(initialWeeks, initialObject.weeklyPages)
  }, [group])

  // recalculate pages when the user changes the number of weeks
  useEffect(() => {
    if (!group) return null
    const newWeeks = parseInt(watchWeeks)
    setWeeks(newWeeks)
    const newWeeklyPages = parseInt(group.bookPageCount / newWeeks)
    fillOutWeekValues(newWeeks, newWeeklyPages)
  }, [watchWeeks])

  if (!group) return null

  const displayRecommendation = () => {
    const weeklyAmount = suggestWeeklyAmount(group.bookPageCount)

    if (weeklyAmount.remainder === weeklyAmount.weeklyPages) {
      return (
        <p className='content is-size-5'>We recommend scheduling {weeklyAmount.recommendedWeeks} weeks of discussion covering {weeklyAmount.weeklyPages} pages each week.</p>
      )
    } else {
      return (
        <p className='content is-size-5'>We recommend scheduling {weeklyAmount.recommendedWeeks} weeks of discussion covering {weeklyAmount.weeklyPages} pages each week, with {weeklyAmount.remainder} pages on the final week.</p>
      )
    }
  }

  const submitSchedule = () => {
    console.log('bonk') // not implemented yet on the server
  }

  const handleScheduleForm = () => {
    let weekList = []

    const weeklyReading = parseInt(group.bookPageCount / weeks)

    const calculatePage = i => {
      if (i === weeks) return group.bookPageCount
      return weeklyReading * i
    }

    for (let i = 1; i <= weeks; i++) {
      weekList = weekList.concat(
        <tr key={i}>
          <th className='is-centered'>{`${i}`}</th>
          <td>
            <div className='field is-horizontal'>
              <div className='control'>
                <input
                  className='input'
                  type='number'
                  name={`week${i}`}
                  defaultValue={calculatePage(i)} // make sure the last item is properly filled in
                  ref={register({
                    required: {
                      value: true,
                      message: 'All weeks must have a page value'
                    }
                  })}
                />
              </div>
            </div>
          </td>
        </tr>
      )
    }

    return (
      <>
        {weekList}
      </>
    )
  }

  const getDate = () => {
    const currentDate = new Date()

    // days and months must have two digits
    // e.g. 4th day of the month becomes 04
    const expandDate = date => {
      if (date < 10) return `0${date}`
      else return date
    }

    const dateForForm = `${currentDate.getFullYear()}-${expandDate(currentDate.getMonth() + 1)}-${expandDate(currentDate.getDate())}`
    return dateForForm
  }

  return (
    <div>
      <h1 className='title'>Schedule</h1>
      <p className='subtitle has-text-danger'>(Note: This form does not actually submit to the server yet. It is only here for mockup purposes while the scheduling feature is in the planning stages.)</p>
      <div className='card mt-4 mb-4'>
        <div className='card-content'>
          <p className='content is-size-5'>It looks like <span className='has-text-primary'>{group.bookTitle}</span> has {group.bookPageCount} pages.</p>
          {displayRecommendation()}
          <p className='content is-size-6'>You can adjust the number of weeks and the page goal for each week below.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(submitSchedule)}>
        <ErrorMessage errors={errors} name='weeks' />
        <div className='level has-text-centered'>
          <div className='field level-item is-block'>
            <label className='field-label'>Weeks</label>
            <div className='control'>
              <input
                style={{ maxWidth: '100px' }}
                className='input is-medium'
                type='number'
                name='weeks'
                min='1'
                max='26'
                defaultValue={suggestWeeklyAmount(group.bookPageCount).recommendedWeeks}
                ref={register({
                  required: {
                    value: true,
                    message: 'Number of weeks is required'
                  }
                })}
              />
            </div>
          </div>
          <div className='field level-item is-block'>
            <label className='field-label'>Start Date</label>
            <div className='control'>
              <input
                style={{ maxWidth: '180px' }}
                className='input is-medium'
                type='date'
                name='startDate'
                defaultValue={getDate()}
                ref={register({
                  required: {
                    value: true,
                    message: 'Start date is required'
                  }
                })}
              />
            </div>
          </div>
        </div>
        <div className='box' style={{ maxWidth: '300px', marginRight: 'auto', marginLeft: 'auto' }}>
          <table className='table is-striped is-hoverable has-text-centered'>
            <thead>
              <tr>
                <th>Week</th>
                <th><abbr title='Read up to this page'>Page</abbr></th>
              </tr>
            </thead>
            <tbody>
              {handleScheduleForm()}
            </tbody>
          </table>
        </div>
        <div className='has-text-centered'>
          <button className='button is-primary' type='submit' value='Submit'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default GroupScheduler