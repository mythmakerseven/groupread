/* eslint-disable react/prop-types */
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { titleCase } from 'title-case' // 27KB library - might implement the functionality myself and drop it
import { Button, Header, Modal, List, Image, Placeholder } from 'semantic-ui-react'
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'


const OpenLibraryResults = ({ queryTitle, queryAuthor, queryIsbn, modalOpen, closeModal }) => {
  const [results, setResults] = useState([])

  const dispatch = useDispatch()

  const queryOL = (title, author, isbn) => {
    const titleString = title ? `title=${title}` : null
    const authorString = author ? `author=${author}` : null
    const isbnString = isbn ? `isbn=${isbn}` : null

    const queryArray = [titleString, authorString, isbnString].filter(q => q)
    const queryString = `https://openlibrary.org/search.json?${queryArray.join('&')}`
    return queryString
  }

  useEffect(async () => {
    if (modalOpen) {
      const searchUrl = queryOL(queryTitle, queryAuthor, queryIsbn)
      console.log(`querying ${searchUrl}`)
      const resultsObject = await axios.get(searchUrl)
      setResults(resultsObject.data.docs)
    } else {
      setResults([])
    }
  }, [modalOpen])

  const updateForm = (title, author, year, isbn, olid) => {
    dispatch(formUpdateTitle(titleCase(title)))
    dispatch(formUpdateAuthor(author))
    dispatch(formUpdateYear(year))
    dispatch(formUpdateIsbn(isbn))
    dispatch(formUpdateOLID(olid))
    closeModal()
  }

  const displayResults = results => {
    // TODO: handle loading differently from searches with 0 results
    if (results.length === 0) {
      return (
        <Placeholder>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder>
      )
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
        <Button floated='right' onClick={() => updateForm(
          r.title,
          r.author_name ? r.author_name[0] : null,
          r.publish_year ? r.publish_year[0] : null,
          r.isbn ? r.isbn[0] : null,
          r.cover_edition_key
        )}>Add info</Button>
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