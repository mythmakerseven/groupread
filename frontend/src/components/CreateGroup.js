import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createGroup } from '../reducers/groupReducer'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Header, Button, Form } from 'semantic-ui-react'
import OpenLibraryResults from './OpenLibraryResults'
import { useHistory } from 'react-router-dom'

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
    history.push(`/group/${groupFromServer.id}`)
  }

  const queryTitle = watch('bookTitle')
  const queryAuthor = watch('bookAuthor')
  const queryIsbn = watch('bookIsbn')

  useEffect(() => {
    if (!openModal) {
      setValue('bookTitle', groupFormData.bookTitle, { shouldValidate: true })
    }
  }, [openModal])

  // TODO: add validation on the group creation form to match server-side
  return (
    <div>
      <Header as="h4">Tip: Click &quot;Find info&quot; to fill out empty fields based on what you&apos;ve entered.</Header>
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