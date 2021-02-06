import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useParams } from 'react-router-dom'
import { getGroupDetails } from '../reducers/groupReducer'

const GroupScheduler = () => {
  const [weeks, setWeeks] = useState(4)
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, errors } = useForm()

  const watchWeeks = watch('weeks')

  const { id } = useParams()

  useEffect(() => {
    dispatch(getGroupDetails(id))
  }, [id])

  const findWeeklyAmount = pageCount => {
    if (pageCount <= 500) {
      // setWeeks(4)
      const weeklyPages = parseInt(pageCount / 4)
      return ({
        recommendedWeeks: 4,
        weeklyPages: weeklyPages,
        remainder: pageCount - (weeklyPages * 3)
      })
    } else {
      // setWeeks(8)
      const weeklyPages = parseInt(pageCount / 8)
      return ({
        recommendedWeeks: 8,
        weeklyPages: weeklyPages,
        remainder: pageCount - (weeklyPages * 7)
      })
    }
  }

  const groups = useSelector(({ group }) => group)
  const group = groups.find(group => group.id === id)

  useEffect(() => {
    if (!group) return null
    setWeeks(watchWeeks)
  }, [watchWeeks])

  if (!group) return null

  const displayRecommendation = () => {
    const weeklyAmount = findWeeklyAmount(group.bookPageCount)

    if (weeklyAmount.remainder === weeklyAmount.weeklyPages) {
      return (
        <p className='is-size-4'>We recommend scheduling {weeklyAmount.recommendedWeeks} weeks of discussion covering {weeklyAmount.weeklyPages} pages each week.</p>
      )
    } else {
      return (
        <p className='is-size-4'>We recommend scheduling {weeklyAmount.recommendedWeeks} weeks of discussion covering {weeklyAmount.weeklyPages} pages each week, with {weeklyAmount.remainder} pages on the final week.</p>
      )
    }
  }

  const submitSchedule = () => {
    console.log('boink') // not implemented serverside yet
  }

  const handleScheduleForm = () => {
    const bookInfo = findWeeklyAmount(group.bookPageCount)

    const handleDefaultValue = i => {
      if (i === weeks) {
        return ((bookInfo.weeklyPages) * (weeks - 1)) + bookInfo.remainder
      }
      const alreadyRead = i * bookInfo.weeklyPages
      return alreadyRead
    }

    let weekList = []

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
                  defaultValue={handleDefaultValue(i)}
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

  return (
    <div>
      <h1 className='title'>Schedule</h1>
      <p className='subtitle'>(Note: This form does not actually submit to the server yet. It is only here for mockup purposes while the scheduling feature is in the planning stages.)</p>
      <br />
      <p className='is-size-4'>It looks like {group.bookTitle} has {group.bookPageCount} pages.</p>
      {displayRecommendation()}
      <p>You can adjust the number of weeks and the page goal for each week below.</p>
      <form onSubmit={handleSubmit(submitSchedule)}>
        <ErrorMessage errors={errors} name='weeks' />
        <div className='field'>
          <label className='label'>Weeks</label>
          <div className='control'>
            <input
              style={{ width: '80px' }}
              className='input is-medium'
              type='number'
              name='weeks'
              defaultValue={findWeeklyAmount(group.bookPageCount).recommendedWeeks}
              ref={register({
                required: {
                  value: true,
                  message: 'Number of weeks is required'
                }
              })}
            />
          </div>
        </div>
        <table className='table is-striped is-hoverable'>
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
      </form>
    </div>
  )
}

export default GroupScheduler