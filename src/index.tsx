import {loadDevTools} from 'dev-tools/load'
import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider, ReactQueryProviderConfig} from 'react-query'
import {App} from './app'
import {AuthProvider} from 'context/auth-context'

const queryConfig: ReactQueryProviderConfig = {
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

loadDevTools(() => {
  ReactDOM.render(
    <React.StrictMode>
      <ReactQueryConfigProvider config={queryConfig}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReactQueryConfigProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  )
})
