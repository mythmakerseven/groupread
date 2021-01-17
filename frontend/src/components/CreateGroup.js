import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createGroup } from '../reducers/groupReducer'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Header, Button, Form } from 'semantic-ui-react'
import OpenLibraryResults from './OpenLibraryResults'
import { useHistory } from 'react-router-dom'
import { initialState as initialFormState } from '../reducers/groupCreationReducer'
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'

const CreateGroup = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()
  const { register, handleSubmit, setValue, watch, errors } = useForm()

  const groupFormData = useSelector(({ groupFormData }) => groupFormData)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const handleGroup = async (data) => {
    const groupObject = {
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookYear: data.bookYear,
      bookIsbn: data.bookIsbn,
      bookOLID: groupFormData.bookOLID
    }

    const groupFromServer = await dispatch(createGroup(groupObject))

    // TODO: refactor the form reducer to take just one dispatch
    dispatch(formUpdateTitle(''))
    dispatch(formUpdateAuthor(''))
    dispatch(formUpdateYear(''))
    dispatch(formUpdateIsbn(''))
    dispatch(formUpdateOLID(''))

    history.push(`/group/${groupFromServer.id}`)
  }

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

  // TODO: add validation on the group creation form to match server-side
  return (
    <div>
      <Header as="h4">Tip: Click &quot;Find info&quot; to fill out empty fields based on what you&apos;ve entered.</Header>
      <Header as='h4'>If something looks wrong after fetching info, you can still make changes in the form.</Header>
      <Form onSubmit={handleSubmit(handleGroup)}>
        <ErrorMessage errors={errors} name="bookTitle" message="Book title is required" />
        <Form.Field>
          <label>Title</label>
          <input name="bookTitle" defaultValue={groupFormData.bookTitle} ref={register( { required: true })} />
        </Form.Field>
        <Form.Field>
          <label>Author</label>
          <input name="bookAuthor" defaultValue={groupFormData.bookAuthor} ref={register} />
        </Form.Field>
        <Form.Field>
          <label>Year of Publication</label>
          <input name="bookYear" defaultValue={groupFormData.bookYear} ref={register} />
        </Form.Field>
        <Form.Field>
          <label>ISBN</label>
          <input name="bookIsbn" defaultValue={groupFormData.bookIsbn} ref={register} />
        </Form.Field>
        <Button type="button" onClick={openModal}>Find info</Button>
        <Button type="submit">Create Group</Button>
        <OpenLibraryResults
          queryTitle={queryTitle}
          queryAuthor={queryAuthor}
          queryIsbn={queryIsbn}
          modalOpen={modalOpen}
          closeModal={closeModal}
        />
      </Form>
    </div>
  )
}

export default CreateGroup