/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import * as authClient from 'utils/auth-client'
import {useAsync} from 'utils/use-async'
import {FullPageErrorFallback, FullPageSpinner} from 'components/lib'
import {IAuthContext} from './auth-context.api'
import {User, UserForm} from 'models/user'

const AuthContext = React.createContext<IAuthContext | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

function AuthProvider(props: React.PropsWithChildren<{}>) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status,
  } = useAsync<User | null>()

  React.useEffect(() => {
    run(authClient.getUser())
  }, [run])

  function login(form: UserForm) {
    return authClient.login(form).then(user => setData(user))
  }

  function register(form: UserForm) {
    return authClient.register(form).then(user => setData(user))
  }

  function logout() {
    authClient.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error as Error} />
  }

  if (isSuccess && user) {
    const value = {user, login, register, logout}
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {AuthProvider, useAuth}
