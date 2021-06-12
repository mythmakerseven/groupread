import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { titleCase } from 'title-case'
import { formUpdateTitle, formUpdateAuthor, formUpdateYear, formUpdateIsbn, formUpdateOLID } from '../reducers/groupCreationReducer'

interface Props {
  queryTitle: string | null,
  queryAuthor: string | null,
  queryIsbn: string | null,
  open: boolean,
  setOpen: (event: boolean) => void
}

const OpenLibraryResults: React.FC<Props> = ({ queryTitle, queryAuthor, queryIsbn, open, setOpen }) => {
  // OpenLibrary entries vary in which fields they include, so it's not useful to type them
  const [results, setResults] = useState<OpenLibraryResults[] | null>(null)

  const dispatch = useAppDispatch()

  const queryOL = (title: string | null, author: string | null, isbn: string | null) => {
    const titleString = title ? `title=${title}` : null
    const authorString = author ? `author=${author}` : null
    const isbnString = isbn ? `isbn=${isbn}` : null

    const queryArray = [titleString, authorString, isbnString].filter(q => q)
    const queryString = `https://openlibrary.org/search.json?${queryArray.join('&')}`
    return queryString
  }

  useEffect(() => {
    const findResults = async (searchUrl: string) => {
      const resultsObject = await axios.get(searchUrl)
      return setResults(resultsObject.data.docs)
    }

    if (open) {
      const searchUrl = queryOL(queryTitle, queryAuthor, queryIsbn)
      // avoid spamming OL's servers with empty searches
      if (searchUrl === 'https://openlibrary.org/search.json?') {
        return setResults([])
      }
      findResults(searchUrl)
    } else {
      return setResults(null)
    }
  }, [open])

  // Not all books have every bit of metadata, but out of these I think only author is the one
  // with possible empty fields.
  const updateForm = (title: string, author: string | null, year: number | null, isbn: string | null, olid: string) => {
    dispatch(formUpdateTitle(titleCase(title)))
    dispatch(formUpdateAuthor(author))
    dispatch(formUpdateYear(year))
    dispatch(formUpdateIsbn(isbn))
    dispatch(formUpdateOLID(olid))
    setOpen(false)
  }

  // Look at the author_name field from OL, which may be empty or have 1+ authors,
  // and generate the proper string to display them. This string is stored as the
  // author name in the DB, for now. Would really prefer a proper author array in
  // the DB, but this works as a band-aid.
  const parseAuthors = (authorList: Array<string> | null): string | null => {
    if (!authorList || authorList.length === 0) {
      return null
    } else if (authorList.length === 1) {
      return authorList[0]
    } else if (authorList.length === 2) {
      return `${authorList[0]} and ${authorList[1]}`
    } else {
      return `${authorList[0]}, ${authorList[1]}, et al.`
    }
  }

  interface OpenLibraryResults {
    key: string,
    title: string,
    author_name: string[] | null,
    publish_year: number[] | null,
    isbn: string[] | null,
    cover_edition_key: string
  }

  const displayResults = (results: OpenLibraryResults[] | null) => {
    if (!results) {
      return <p className='subtitle'>loading...</p>
    }

    if (results.length === 0) {
      return <p className='subtitle'>No results found</p>
    }

    return results.map(r =>
      <div className='media' key={`${r.key}`} style={{ minHeight: '100px' }}>
        <figure className='media-left'>
          <p className='image'>
            <img src={`http://covers.openlibrary.org/b/olid/${r.cover_edition_key}-S.jpg`}/>
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <p className='title is-size-4'>{r.title}</p>
            <p className='subtitle'>{parseAuthors(r.author_name)}</p>
          </div>
        </div>
        <div className='media-right'>
          <button className='button' type='button' onClick={() => updateForm(
            r.title,
            parseAuthors(r.author_name),
            r.publish_year ? r.publish_year[0] : null,
            r.isbn ? r.isbn[0] : null,
            r.cover_edition_key
          )}>Add info</button>
        </div>
      </div>
    )
  }

  return (
    <div className={open ? 'modal is-active' : 'modal'}>
      <div className='modal-background' onClick={() => setOpen(false)} />
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Find a Book</p>
          <button className="delete" aria-label="close" onClick={() => setOpen(false)}></button>
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

export default OpenLibraryResults