import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='content has-text-centered'>
        <p>Book metadata provided by the <a href="https://openlibrary.org/">Open Library API</a></p>
        <p><Link to='/compatibility'>Supported platforms</Link></p>
        <p>This website is currently under development. If you experience a bug, please <a href='https://github.com/mythmakerseven/groupread/issues'>report it</a>.</p>
      </div>
    </footer>
  )
}

export default Footer