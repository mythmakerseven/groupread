import React from 'react'
import './index.css'

// webpack-dev-server does not refresh the browser when code is updated
// due to this bug: https://github.com/webpack/webpack-dev-server/issues/2758
// TODO: either upgrade to the webpack beta or wait for bugfix

const App = () => {
  return (
    <div className="container">
      hello webpack and webpack-dev-server
    </div>
  )
}

export default App