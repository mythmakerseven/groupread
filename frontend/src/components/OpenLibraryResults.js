import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { titleCase } from 'title-case' // 27KB library - might implement the functionality myself and drop it
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'
import PropTypes from 'prop-types'


const OpenLibraryResults = ({ queryTitle, queryAuthor, queryIsbn, open, setOpen }) => {
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
    if (open) {
      const searchUrl = queryOL(queryTitle, queryAuthor, queryIsbn)
      const resultsObject = await axios.get(searchUrl)
      setResults(resultsObject.data.docs)
    } else {
      setResults([])
    }
  }, [open])

  const updateForm = (title, author, year, isbn, olid) => {
    dispatch(formUpdateTitle(titleCase(title)))
    dispatch(formUpdateAuthor(author))
    dispatch(formUpdateYear(year))
    dispatch(formUpdateIsbn(isbn))
    dispatch(formUpdateOLID(olid))
    setOpen(false)
  }

  const displayResults = results => {
    // TODO: the switch to Bulma broke this loading placeholder, find suitable reimplementation
    // TODO: handle loading differently for searches with 0 results
    if (results.length === 0) {
      return null
    }

    return results.map(r =>
      <div className='media' key={`${r.key}`} style={{ minHeight: '100px', fontSize: '1.2em' }}>
        <figure className='media-left'>
          <p className='image'>
            <img src={`http://covers.openlibrary.org/b/olid/${r.cover_edition_key}-S.jpg`}/>
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <h1 className='title'>{r.title}</h1>
            <h1 className='subtitle'>{r.author_name}</h1>
          </div>
        </div>
        <div className='media-right'>
          <button className='button' type='button' onClick={() => updateForm(
            r.title,
            r.author_name ? r.author_name[0] : null,
            r.publish_year ? r.publish_year[0] : null,
            r.isbn ? r.isbn[0] : null,
            r.cover_edition_key
          )}>Add info</button>
        </div>
      </div>
    )
  }

  return (
    <div className={open ? 'modal is-active has-background-light' : 'modal has-background-light'}>
      <div className='modal-background' onClick={() => setOpen(false)} />
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Find a Book</p>
          {/* TODO: add an icon for the close button*/}
          <button className='delete' type='button' aria-label='close' onClick={() => setOpen(false)}>X</button>
        </header>
        <section className='modal-card-body'>
          {displayResults(results)}
        </section>
        <footer className='modal-card-foot'>
          <p>Books found via the OpenLibrary API</p>
        </footer>
      </div>
    </div>
  )
}

OpenLibraryResults.propTypes = {
  queryTitle: PropTypes.string,
  queryAuthor: PropTypes.string,
  queryIsbn: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
}

export default OpenLibraryResults