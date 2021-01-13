import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createGroup } from '../reducers/groupReducer'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Header, Button, Form } from 'semantic-ui-react'
import OpenLibraryResults from './OpenLibraryResults'

import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn } from '../reducers/groupCreationReducer'

const CreateGroup = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm()

  const bookFormData = useSelector(({ groupFormData }) => groupFormData)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const handleGroup = async (data) => {
    const groupObject = {
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookYear: data.bookYear,
      bookIsbn: data.bookIsbn
    }

    const res = dispatch(createGroup(groupObject))
    return console.log(res)
  }

  const handleTitleChange = event => {
    dispatch(formUpdateTitle(event.target.value))
  }

  const handleAuthorChange = event => {
    dispatch(formUpdateAuthor(event.target.value))
  }

  const handleYearChange = event => {
    dispatch(formUpdateYear(event.target.value))
  }

  const handleIsbnChange = event => {
    dispatch(formUpdateIsbn(event.target.value))
  }

  return (
    <div>
      <Header as="h4">Tip: Don&apos;t know all the information? Click &quot;Find info&quot; to search.</Header>
      <Form onSubmit={handleSubmit(handleGroup)}>
        <ErrorMessage errors={errors} name="bookTitle" message="Book title is required" />
        <Form.Field>
          <label>Title</label>
          <input name="bookTitle" defaultValue={bookFormData.bookTitle} onChange={handleTitleChange} ref={register( { required: true })} />
        </Form.Field>
        <Form.Field>
          <label>Author</label>
          <input name="bookAuthor" defaultValue={bookFormData.bookAuthor} onChange={handleAuthorChange} ref={register} />
        </Form.Field>
        <Form.Field>
          <label>Year of Publication</label>
          <input name="bookYear" defaultValue={bookFormData.bookYear} onChange={handleYearChange} ref={register} />
        </Form.Field>
        <Form.Field>
          <label>ISBN</label>
          <input name="bookIsbn" defaultValue={bookFormData.bookIsbn} onChange={handleIsbnChange} ref={register} />
        </Form.Field>
        <Button type="button" onClick={openModal}>Find info</Button>
        <Button type="submit">Create Group</Button>
        <OpenLibraryResults
          modalOpen={modalOpen}
          closeModal={closeModal}
        />
      </Form>
    </div>
  )
}

export default CreateGroup