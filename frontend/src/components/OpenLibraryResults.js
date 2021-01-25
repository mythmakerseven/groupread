import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { titleCase } from 'title-case' // 27KB library - might implement the functionality myself and drop it
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'
import PropTypes from 'prop-types'


const OpenLibraryResults = ({ queryTitle, queryAuthor, queryIsbn, open, setOpen }) => {
  const [results, setResults] = useState(null)

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
      console.log(searchUrl)
      // avoid querying OL's servers with empty searches
      if (searchUrl === 'https://openlibrary.org/search.json?') {
        return setResults([])
      }

      const resultsObject = await axios.get(searchUrl)
      return setResults(resultsObject.data.docs)
    } else {
      return setResults(null)
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
    if (!results) {
      return <p className='subtitle'>loading...</p>
    }

    if (results.length === 0) {
      return <p className='subtitle'>No results found</p>
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
            <p className='title'>{r.title}</p>
            <p className='subtitle'>{r.author_name}</p>
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

  // const closeButton =
  //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon bi bi-x-circle " aria-label='close' viewBox="0 0 16 16" onClick={() => setOpen(false)}>
  //     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  //     <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  //   </svg>

  return (
    <div className={open ? 'modal is-active' : 'modal'}>
      <div className='modal-background' onClick={() => setOpen(false)} />
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Find a Book</p>
          {/* TODO: add an icon for the close button*/}
          <button className="delete" aria-label="close"></button>
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