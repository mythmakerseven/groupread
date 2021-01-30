import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <section className='hero is-primary is-medium'>
        <div className='hero-body'>
          <div className='container has-text-centered '>
            <h1 className='title'>Read books with your friends.</h1>
            <Link className='subtitle' to='/groups'>Click here to see a list of groups.</Link>
          </div>
        </div>
      </section>
      <section className='hero is-info is-medium'>
        <div className='hero-body'>
          <div className='container has-text-centered'>
            <p className='title'>Automatically schedule discussions</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage