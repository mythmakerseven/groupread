/* eslint-disable react/prop-types */
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Header, Modal, List, Image } from 'semantic-ui-react'
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn } from '../reducers/groupCreationReducer'


const OpenLibraryResults = ({ modalOpen, closeModal }) => {
  const [results, setResults] = useState([])

  const dispatch = useDispatch()

  // const bookFormData = useSelector(({ groupFormData }) => groupFormData) // infinite loop 1

  const getBookFormData = () => {
    const bookFormData = useSelector(({ groupFormData }) => groupFormData)
    return bookFormData
  }

  const queryOL = data => {
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

  useEffect(async () => {
    if (modalOpen) {
      const searchUrl = queryOL(getBookFormData())  // infinite loop 2
      console.log(`querying ${searchUrl}`)
      const resultsObject = await axios.get(searchUrl)
      setResults(resultsObject.data.docs)
    }
  }, [modalOpen])

  const updateForm = (title, author) => {
    dispatch(formUpdateTitle(title))  // infinite loop 3
    dispatch(formUpdateAuthor(author))
    closeModal()
  }

  const displayResults = results => {
    if (!results || results === []) { // TODO: this doesn't function when results are null or empty
      return <p>loading...</p>        // i.e. it doesn't function at all lmao
    }

    return results.map(r =>
      <List.Item key={`${r.key}`} style={{ minHeight: '100px', fontSize: '1.2em' }}>
        <Image src={`http://covers.openlibrary.org/b/olid/${r.cover_edition_key}-S.jpg`}/>
        <List.Content>
          <List.Header as="a">{r.title}</List.Header>
          <List.Description>
            by <b>{r.author_name}</b>
          </List.Description>
        </List.Content>
        <Button floated='right' onClick={updateForm(r.title, r.author_name)}>Add info</Button>
      </List.Item>
    )
  }

  return (
    <Modal
      size='small'
      onClose={closeModal}
      open={modalOpen}
    >
      <Modal.Header>Find a Book</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header>List of Books</Header>
          <p>Books found via the OpenLibrary API:</p>
        </Modal.Description>
        <List celled>
          {displayResults(results)}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={closeModal}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default OpenLibraryResults