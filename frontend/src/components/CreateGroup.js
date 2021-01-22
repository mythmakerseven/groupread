import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createGroup } from '../reducers/groupReducer'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import OpenLibraryResults from './OpenLibraryResults'
import { useHistory } from 'react-router-dom'
import { initialState as initialFormState } from '../reducers/groupCreationReducer'
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'

const CreateGroup = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, watch, setError, errors } = useForm()

  const groupFormData = useSelector(({ groupFormData }) => groupFormData)

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

  const handleGroup = async (data) => {
    const groupObject = {
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookYear: data.bookYear,
      bookIsbn: data.bookIsbn,
      bookOLID: groupFormData.bookOLID
    }

    const res = await dispatch(createGroup(groupObject))

    if (res.error) {
      return setError('bookTitle', { message: `${res.error}` })
    }

    dispatch(formUpdateTitle(''))
    dispatch(formUpdateAuthor(''))
    dispatch(formUpdateYear(''))
    dispatch(formUpdateIsbn(''))
    dispatch(formUpdateOLID(''))

    history.push(`/group/${res.id}`)
  }

  // TODO: more client-side validation to match serverside
  // can likely be done easily with react-hook-form params
  return (
    <div>
      <h1 className='title'>Create a group</h1>
      <h1 className='subtitle'>Tip: Click &quot;Find info&quot; to fill out empty fields based on what you&apos;ve entered.</h1>
      <h1 className='subtitle'>If something looks wrong after fetching info, you can still make changes in the form.</h1>
      <form onSubmit={handleSubmit(handleGroup)}>
        <ErrorMessage errors={errors} name="bookTitle" message="Book title is required" />
        <div className='field'>
          <label className='label'>Title</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='The Brothers Karamazov'
              name='bookTitle'
              defaultValue={groupFormData.bookTitle}
              ref={register( { required: true })}
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Author</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='Fyodor Dostoyevsky'
              name='bookAuthor'
              defaultValue={groupFormData.bookAuthor}
              ref={register}
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Year</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='1880'
              name='bookYear'
              defaultValue={groupFormData.bookYear}
              ref={register}
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>ISBN</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='9780374528379'
              name='bookIsbn'
              defaultValue={groupFormData.bookIsbn}
              ref={register}
            />
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