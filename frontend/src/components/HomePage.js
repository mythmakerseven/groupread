import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <section className='hero is-link is-fullheight'>
      <div className='hero-body'>
        <div className='container has-text-centered '>
          <h1 className='title'>Read books with your friends.</h1>
          <Link className='subtitle' to='/groups'>Click here to see a list of groups.</Link>
        </div>
      </div>
    </section>
  )
}

export default HomePage