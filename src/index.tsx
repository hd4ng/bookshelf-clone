import {loadDevTools} from 'dev-tools/load'
import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

import {App} from './app'

loadDevTools(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  )
})
