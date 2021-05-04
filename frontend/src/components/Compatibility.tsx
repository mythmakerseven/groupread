import React from 'react'

const Compatibility: React.FC = () => (
  <div className='container pt-4 pb-4'>
    <div className='content'>
      <h1 className='title'>What platforms does Groupread support?</h1>
      <p>Groupread officially supports a wide range of web browsers. You may still be able to use Groupread if your browser is not on this list. Unfortunately, Groupread does not support Internet Explorer or old versions of Microsoft Edge.</p>
      <p>On PC and Mac, Groupread should work with any of the following browsers:</p>
      <ul>
        <li>Mozilla Firefox</li>
        <li>Google Chrome</li>
        <li>Microsoft Edge (only the new version)</li>
        <li>Opera</li>
        <li>Safari (only on macOS Big Sur and later)</li>
      </ul>
      <p>On iOS (only on iOS 14 and later):</p>
      <ul>
        <li>Safari</li>
        <li>Any other browser (all iOS browsers use the Safari engine)</li>
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