import React from 'react'
import unknownCover from '../../../static/images/unknown_cover.png'

export enum CoverSize {
  Small = 'S',
  Medium = 'M',
  Large = 'L'
}

interface Props {
  size: CoverSize,
  olid: string | null
}

const BookCover: React.FC<Props> = ({ size, olid }) => {
  if (!olid) {
    return <img
      src={unknownCover}
      alt=""
      className='image cover-image is-inline-block'
    />
  }

  return <img
    src={`https://covers.openlibrary.org/b/olid/${olid}-${size}.jpg`}
    alt=""
    className='image cover-image is-inline-block'
  />
}

export default BookCover