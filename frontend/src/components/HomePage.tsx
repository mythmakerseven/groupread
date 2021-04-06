import React from 'react'
import { Link } from 'react-router-dom'
import backgroundImg from '../images/freestocks-OfaDD5o8hpk-unsplash.jpg'

const HomePage = () => {
  return (
    <div>
      <section className='homepage-hero hero is-black is-fullheight-with-navbar' style={{ backgroundImage: `url(${backgroundImg})` }}>
        <div className='hero-body'>
          <div className='container'>
            <div className='has-text-centered hero-text p-4'>
              <h1 className='title is-size-1 homepage-title p-4'>Read books with your friends.</h1>
              <div className='content p-4'>
                <p>Join exclusive, members-only reading groups</p>
                <p>Automatically schedule discussions</p>
                <p>Invite your friends or make new ones</p>
              </div>
            </div>
            <div className='has-text-centered hero-text p-4 mt-4'>
              <Link to='/groups' className='is-size-4 p-4 homepage-group-link'>
                <b>See what people are reading &#10132;</b>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage