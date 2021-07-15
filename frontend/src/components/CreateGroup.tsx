import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createGroup } from '../reducers/groupReducer'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import OpenLibraryResults from './OpenLibraryResults'
import { useHistory } from 'react-router-dom'
import { initialState as initialFormState } from '../reducers/groupCreationReducer'
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'
import { ErrorTypes, GroupCreationData } from '../types'
import ErrorPage from './ErrorPage'

const CreateGroup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const dispatch = useAppDispatch()
  const history = useHistory()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,

    formState: {
      errors,
    },
  } = useForm<GroupCreationData>()

  const groupFormData = useAppSelector(({ groupFormData }) => groupFormData)
  const user = useAppSelector(({ user }) => user)

  const queryTitle = watch('bookTitle')
  const queryAuthor = watch('bookAuthor')
  const queryIsbn = watch('bookIsbn')

  useEffect(() => {
    if (!modalOpen && groupFormData !== initialFormState) {
      setValue('bookTitle', groupFormData.bookTitle)
      setValue('bookAuthor', groupFormData.bookAuthor)
      setValue('bookYear', groupFormData.bookYear)
      setValue('bookIsbn', groupFormData.bookIsbn)
    }
  }, [modalOpen])

  useEffect(() => {
    // There are two possible "paths" to this component.
    // 1) Check for the loading property in user state if the user is still being initialized
    //     (e.g. if the user directly accesses this component and clientside cookies are still being read)
    // 2) Check for a token if the user is already initialized
    //     (if the user navigates here from another component with user state already initialized)

    if (user.loading === false || user.data?.token) {
      setIsLoading(false)
    }
  }, [user])

  if (!user || !user.data) {
    if (isLoading) {
      return <p>loading...</p>
    } else {
      return (
        <ErrorPage
          errorType={ErrorTypes.Unauthorized}
        />
      )
    }
  }

  const handleGroup = async (data: GroupCreationData) => {
    const groupObject = {
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookYear: Number(data.bookYear),
      bookIsbn: data.bookIsbn,
      bookPageCount: Number(data.bookPageCount),
      bookOLID: groupFormData.bookOLID
    }

    // I don't know why TS thinks data is possibly null because there's null-checking above.
    // But this line makes it happy.
    if (!user.data?.token) {
      return setError('bookTitle', { message: 'Authentication error. Are you signed in?' })
    }

    try {
      const res = await dispatch(createGroup({
        groupObject: groupObject,
        token: user.data.token
      })).unwrap()

      // Even though the form is about to go out of view, we still need to reset
      // in case the user opens it again later.
      dispatch(formUpdateTitle(null))
      dispatch(formUpdateAuthor(null))
      dispatch(formUpdateYear(null))
      dispatch(formUpdateIsbn(null))
      dispatch(formUpdateOLID(null))

      history.push(`/groups/${res.id}/schedule`)
    } catch(e) {
      return setError('bookTitle', { message: `${e.message}` })
    }
  }

  // TODO: more client-side validation to match serverside
  // can likely be done easily with react-hook-form params
  return (
    <div className='container pt-4 pb-4'>
      <h1 className='title'>Create a group</h1>
      <p className='subtitle'>Tip: Click &quot;Find info&quot; to fill out empty fields based on what you&apos;ve entered.</p>
      <p className='subtitle'>If something looks wrong after fetching info, you can still make changes in the form.</p>
      <form onSubmit={handleSubmit(handleGroup)}>
        <ErrorMessage errors={errors} name='bookTitle' />
        <div className='field'>
          <label className='label'>Title</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='e.g. The Brothers Karamazov'
              {...register('bookTitle', {
                required: {
                  value: true,
                  message: 'Book title is required'
                }
              })}
              defaultValue={
                groupFormData.bookTitle
                  ? groupFormData.bookTitle
                  : undefined
              }
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Author</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='e.g. Fyodor Dostoyevsky'
              {...register('bookAuthor')}
              defaultValue={
                groupFormData.bookAuthor
                  ? groupFormData.bookAuthor
                  : undefined
              }
            />
          </div>
        </div>
        <div className='field'>
          <ErrorMessage errors={errors} name='bookYear' />
          <label className='label'>Year</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='e.g. 1880'
              {...register('bookYear', {
                pattern: {
                  value: /^\d{4}$/,
                  message: 'Please enter a valid year'
                }
              })}
              defaultValue={
                groupFormData.bookYear
                  ? groupFormData.bookYear
                  : undefined
              }
            />
          </div>
        </div>
        <div className='field'>
          <ErrorMessage errors={errors} name='bookIsbn' />
          <label className='label'>ISBN</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='e.g. 9780374528379'
              {...register('bookIsbn', {
                // TODO: replace with regex pattern to more specifically enforce length
                minLength: {
                  value: 10,
                  message: 'ISBN must be either 10 or 13 characters'
                },
                maxLength: {
                  value: 13,
                  message: 'ISBN must be either 10 or 13 characters'
                }
              })}
              defaultValue={
                groupFormData.bookIsbn
                  ? groupFormData.bookIsbn
                  : undefined
              }
            />
          </div>
        </div>
        <div className='field'>
          <ErrorMessage errors={errors} name='bookPageCount' />
          <label className='label'>Page count</label>
          <div className='control'>
            <input
              className='input'
              type='number'
              min='1'
              max='100000'
              placeholder='e.g. 776'
              {...register('bookPageCount', {
                required: {
                  value: true,
                  message: 'Please enter a page count'
                },
                pattern: {
                  value: /^\d+$/,
                  message: 'Page count must be a number'
                }
              })} />
          </div>
        </div>
        <div className='buttons'>
          <button className='button is-info' type='button' onClick={() => setModalOpen(true)}>Find info</button>
          <button className='button is-success' type='submit'>Create Group</button>
        </div>
        <OpenLibraryResults
          queryTitle={queryTitle}
          queryAuthor={queryAuthor}
          queryIsbn={queryIsbn}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      </form>
    </div>
  )
}

export default CreateGroup