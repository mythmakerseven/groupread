import React from 'react'

const Compatibility: React.FC = () => (
  <div className='container pt-4 pb-4'>
    <div className='content'>
      <h1 className='title'>What platforms does Groupread support?</h1>
      <p>Groupread officially supports a wide range of web browsers. You may still be able to use Groupread if your browser is not on this list. Unfortunately, Groupread is not able to support Internet Explorer.</p>
      <p>On PC and Mac, Groupread should work with the latest version of the following browsers:</p>
      <ul>
        <li>Mozilla Firefox</li>
        <li>Google Chrome</li>
        <li>Microsoft Edge</li>
        <li>Opera</li>
        <li>Safari</li>
      </ul>
      <p>On iOS:</p>
      <ul>
        <li>Safari</li>
        <li>Google Chrome</li>
        <li>Mozilla Firefox</li>
      </ul>
      <p>On Android:</p>
      <ul>
        <li>Google Chrome</li>
        <li>Samsung Internet</li>
        <li>Mozilla Firefox</li>
        <li>Microsoft Edge</li>
      </ul>
      <p>If you experience a compatibility issue with any of the supported browsers, please file an issue on <a href='https://github.com/mythmakerseven/groupread/issues'>GitHub</a>.</p>
    </div>
  </div>
)

export default Compatibility