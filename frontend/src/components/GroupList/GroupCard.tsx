import React from 'react'

interface Props {
  bookTitle: string,
  bookAuthor: string,
  bookOLID: string
}

const GroupCard: React.FC<Props> = ({ bookTitle, bookAuthor, bookOLID }) => {
  return(
    <div className='card'>
      <div className='card-image'>
        <img className='group-card-image' src={`https://covers.openlibrary.org/b/olid/${bookOLID}-M.jpg`} alt="" />
      </div>
      <div className='content p-4'>
        <p className='title is-size-5'>{bookTitle}</p>
        <p className='subtitle is-size-6'>{bookAuthor}</p>
      </div>
    </div>
  )
}

export default GroupCard