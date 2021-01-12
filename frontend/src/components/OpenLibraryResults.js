/* eslint-disable react/prop-types */
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Button, Header, Modal, List, Image } from 'semantic-ui-react'

const OpenLibraryResults = ({ modalOpen, onClose, searchUrl }) => {
  const [results, setResults] = useState([])

  useEffect(async () => {
    console.log(searchUrl)
    const resultsObject = await axios.get(searchUrl)
    setResults(resultsObject.value)
  }, [])

  if (!results || results === [] || !results.docs) {
    return (
      <p>loading...</p>
    )
  }

  if (results.docs === []) {
    <p>nothing found</p>
  }

  const displayResults = results => {
    return results.docs.map(r => {
      <List.Item key={r.isbn}>
        <Image src={`http://covers.openlibrary.org/b/key/${r.cover_edition_key}-S.jpg`}/>
        <List.Content>
          <List.Header as="a">{r.title}</List.Header>
          <List.Description>
            by <b>{r.author_name[0]}</b>
          </List.Description>
        </List.Content>
      </List.Item>
    })
  }

  return (
    <Modal
      onClose={onClose}
      open={modalOpen}
      // trigger={<Button>Show List</Button>}
    >
      <Modal.Header>Find a Book</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>List of Books</Header>
          <p>Books found via the OpenLibrary API:</p>
        </Modal.Description>
        <List>
          {displayResults(results)}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={onClose}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default OpenLibraryResults