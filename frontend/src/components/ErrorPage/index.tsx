import React from 'react'
import { ErrorTypes } from '../../types'
import sadFace from '../../images/sad_face.png'

interface Props {
  errorType: ErrorTypes
}

const ErrorPage: React.FC<Props> = ({ errorType }) => {
  const displayErrorMessage = () => {
    switch (errorType) {
    case ErrorTypes.Unauthorized:
      return 'You don\'t have permission to see this page.'
    case ErrorTypes.NotFound:
      return 'We couldn\'t find the resource you\'re looking for.'
    default:
      // This shouldn't be shown anywhere, but it's here just in case!
      return 'An error occured displaying this page.'
    }
  }

  return (
    <div className='container pt-4 pb-4'>
      <div className='error-page content has-text-centered'>
        <img
          src={sadFace}
          alt=""
          className='error-sad-face'
        />
        <h1 className='title'>
          Oh no!
        </h1>
        <h2 className='subtitle'>
          {displayErrorMessage()}
        </h2>
      </div>
    </div>
  )
}

export default ErrorPage