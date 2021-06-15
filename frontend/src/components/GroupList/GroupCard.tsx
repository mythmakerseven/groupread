import React from 'react'
import BookCover from '../common/BookCover'
import { CoverSize } from '../common/BookCover'

interface Props {
  bookTitle: string,
  bookAuthor: string,
  bookOLID: string | null
}

const GroupCard: React.FC<Props> = ({ bookTitle, bookAuthor, bookOLID }) => {
  return(
    <div className='card'>
      <div className='group-card-image'>
        <BookCover
          size={CoverSize.Large}
          olid={bookOLID}
        />
      </div>
      <div className='content p-4'>
        <p className='title is-size-5'>{bookTitle}</p>
        <p className='subtitle is-size-6'>{bookAuthor}</p>
      </div>
    </div>
  )
}

export default GroupCard