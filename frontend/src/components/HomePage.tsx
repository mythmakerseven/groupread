import React from 'react'
import { Link } from 'react-router-dom'
import backgroundImg from '../images/freestocks-OfaDD5o8hpk-unsplash.jpg'

const HomePage = () => {
  return (
    <div>
      <section id='home-page' className='homepage-hero hero is-black is-fullheight-with-navbar' style={{ backgroundImage: `url(${backgroundImg})` }}>
        <div className='hero-body'>
          <div className='container is-max-desktop'>
            <div className='has-text-centered hero-text p-6 mb-4'>
              <h1 className='title is-size-1 is-size-3-mobile homepage-title'>Groupread</h1>
              <h1 className='subtitle is-size-4 is-size-6-mobile homepage-title'>Read books with your friends.</h1>
            </div>
            <div className='has-text-centered hero-text p-6'>
              <div className='content'>
                <p>Join exclusive, members-only reading groups</p>
                <p>Automatically schedule discussions</p>
                <p>Invite your friends or make new ones</p>
              </div>
            </div>
            <div className='has-text-centered hero-text p-4 mt-4'>
              <Link to='/groups' id='group-list-link' className='is-size-4 is-size-6-mobile homepage-group-link'>
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