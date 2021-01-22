import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <p>Welcome to Group Read&apos;s temporary development homepage</p>
      <Link to='/list'>Click here to see a list of groups.</Link>
    </div>
  )
}

export default HomePage