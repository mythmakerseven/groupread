import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useHistory, useParams } from 'react-router-dom'
import { setSchedule } from '../../reducers/groupReducer'

interface Props {
  initialWeeks: number,
  pageCount: number
}

const WeekForm: React.FC<Props> = ({ initialWeeks, pageCount }) => {
  const user = useAppSelector(({ user }) => user)
  const { groupID } = useParams<({ groupID: string })>()

  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    handleSubmit,
    setError,
    formState: {
      errors,
    },
  } = useForm()

  if (!user) {
    return <p>Missing/invalid user ID</p>
  }

  const submitSchedule = async (data: any) => {
    const weekData = data
    const res = await dispatch(setSchedule({
      weekObject: weekData,
      groupID: groupID,
      token: user.token
    }))

    if (res.error) {
      return setError('weeks', { message: `${res.error.message}` })
    }

    history.push(`/groups/${groupID}`)
  }

  // Find which page the current week should cover
  const calculatePage = (currentWeek: number): number => {
    if (currentWeek === initialWeeks) {
      return pageCount
    }
    const pagesPerWeek = Math.floor(pageCount / initialWeeks)
    return pagesPerWeek * currentWeek
  }

  // const fillOutWeekValues = (newWeeks: number) => {
  //   // cycle through each week input and update
  //   for (let i = 1; i <= newWeeks; i++) {
  //     setValue(`${i}`, calculatePage(i, newWeeks))
  //     console.log(getValues(`${i}`))
  //   }
  // }

  // recalculate pages when the user changes the number of weeks
  // useEffect(() => {
  //   const newWeeks = parseInt(watchWeeks)
  //   setWeeks(newWeeks)
  //   fillOutWeekValues(newWeeks)
  // }, [watchWeeks])

  const handleScheduleForm = () => {
    // Not easy to type the weeklist object.
    // TODO: Find a better way to handle this that plays nicer with TypeScript.
    // Would need to be updated & tested on the backend too.
    let weekList: any[] = []

    for (let i = 1; i <= initialWeeks; i++) {
      weekList = weekList.concat(
        <tr key={i}>
          <th className='is-centered'>{`${i}`}</th>
          <td>
            <div className='field is-horizontal'>
              <div className='control'>
                <input
                  className='input'
                  type='number'
                  name={`${i}`}
                  // make sure the last item is properly filled in
                  defaultValue={calculatePage(i)}
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
    <form onSubmit={handleSubmit(submitSchedule)}>
      <ErrorMessage errors={errors} name='weeks' />
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
  )
}

export default WeekForm