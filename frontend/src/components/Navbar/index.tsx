import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'
import NavGroupList from './NavGroupList'

const Navbar: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false)

  const checkIfActive = (base: string) => {
    return menuVisible
      ? `${base} is-active`
      : base
  }

  return (
    <nav id='navbar' className='navbar has-shadow is-fixed-top' role='navigation' aria-label='main navigation'>
      <div className='container'>
        <div className='navbar-brand'>
          <Link id='nav-home-link' className='navbar-item' to='/'>&#128218; Home</Link>
          <a role='button' className={checkIfActive('navbar-burger')} onClick={() => setMenuVisible(!menuVisible)} aria-label='menu' aria-expanded='false' data-target='navMenu'>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
          <NavGroupList />
        </div>
        <div className={checkIfActive('navbar-menu')} id='navMenu'>
          <div className='navbar-end'>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar