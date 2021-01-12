import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createGroup } from '../reducers/groupReducer'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Header, Button, Form } from 'semantic-ui-react'
import OpenLibraryResults from './OpenLibraryResults'

const CreateGroup = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, errors } = useForm()

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const handleGroup = async (data) => {
    const groupObject = {
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      bookYear: data.bookYear,
      bookIsbn: data.bookIsbn
    }

    const res = await dispatch(createGroup(groupObject))
    return console.log(res)
  }

  const title = watch('bookTitle')
  const author = watch('bookAuthor')

  const queryOL = (data) => {
    const titleString = data.bookTitle ? `title=${data.bookTitle}` : null

    const authorString = data.bookAuthor ? `author=${data.bookAuthor}` : null

    let searchUrl

    if (titleString && authorString) {
      searchUrl = `https://openlibrary.org/search.json?${titleString}&${authorString}`
    } else if (titleString && !authorString) {
      searchUrl = `https://openlibrary.org/search.json?${titleString}`
    } else {
      searchUrl = `https://openlibrary.org/search.json?${authorString}`
    }

    return searchUrl
  }

  return (
    <div>
      <Header as="h4">Tip: Don&apos;t know all the information? Click &quot;Find info&quot; to search.</Header>
      <p>actually it&apos;s not implemented yet lol</p>
      <Form onSubmit={handleSubmit(handleGroup)}>
        <ErrorMessage errors={errors} name="bookTitle" message="Book title is required" />
        <Form.Field>
          <label>Title</label>
          <input name="bookTitle" defaultValue="" ref={register( { required: true })} />
        </Form.Field>
        <Form.Field>
          <label>Author</label>
          <input name="bookAuthor" ref={register} />
        </Form.Field>
        <Form.Field>
          <label>Year of Publication</label>
          <input name="bookYear" ref={register} />
        </Form.Field>
        <Form.Field>
          <label>ISBN</label>
          <input name="bookIsbn" ref={register} />
        </Form.Field>
        {errors.bookTitleRequired && <span>This field is required</span>}
        <Button type="button" onClick={openModal}>Find info</Button>
        <Button type="submit">Create Group</Button>
        <OpenLibraryResults
          modalOpen={modalOpen}
          onClose={closeModal}
          searchUrl={queryOL({ bookTitle: title, bookAuthor: author })}
        />
      </Form>
    </div>
  )
}

export default CreateGroup