import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import WeekForm from './WeekForm'

interface Props {
  initialWeeks: number,
  pageCount: number
}

const WeekNumberForm: React.FC<Props> = ({ initialWeeks, pageCount }) => {
  const [weeks, setWeeks] = useState<number>(initialWeeks)
  const {
    register,
    watch,
    handleSubmit
  } = useForm()

  const watchWeeks = watch('weeks')

  useEffect(() => {
    setWeeks(watchWeeks)
  }, [watchWeeks])

  return (
    <div>
      <form className='pb-4' onSubmit={handleSubmit(() => null)}>
        <div className='level has-text-centered'>
        <div className='field level-item is-block'>
          <label className='field-label'>Weeks</label>
          <div className='control'>
            <input
              style={{ maxWidth: '100px' }}
              className='input is-medium'
              type='number'
              {...register('weeks', {
                required: {
                  value: true,
                  message: 'Number of weeks is required'
                }
              })}
              min='1'
              max='26'
              defaultValue={initialWeeks} />
          </div>
        </div>
        </div>
      </form>
      <WeekForm initialWeeks={weeks} pageCount={pageCount} />
    </div>
  )
}

export default WeekNumberForm