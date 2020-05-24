import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ReactQueryConfigProvider, ReactQueryProviderConfig} from 'react-query'
import {AuthProvider} from './auth-context'

const queryConfig: ReactQueryProviderConfig = {
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function AppProvider({children}: React.PropsWithChildren<{}>) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  )
}

export {AppProvider}
