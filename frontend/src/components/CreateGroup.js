import React, { useEffect, useState } from 'react'

const CreateGroup = () => {
  const [bookTitle, setBookTitle] = useState('')
  const [bookAuthor, setBookAuthor] = useState('')
  const [bookYear, setBookYear] = useState('')
  const [bookIsbn, setBookIsbn] = useState('')

  const addBook = async (event) => {
    event.preventDefault()

    const groupObject = {
      title: bookTitle,
      author: bookAuthor,
      year: bookYear,
      isbn: bookIsbn
    }


  }
}

export default CreateGroup