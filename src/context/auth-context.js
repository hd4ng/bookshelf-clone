import React from 'react'
import * as auth from '../utils/auth'

const AuthContext = React.createContext()

function authReducer(state, action) {
  switch (action.type) {
    case 'fetching': {
      return {isLoading: true, user: null, error: null}
    }
    case 'success': {
      return {isLoading: false, user: action.user, error: null}
    }
    case 'error': {
      return {isLoading: false, user: null, error: action.error}
    }
    case 'logout': {
      return {isLoading: false, user: null, error: null}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAuthContextValue() {
  const [state, dispatch] = React.useReducer(authReducer, {
    isLoading: false,
    user: null,
    error: null,
  })

  const {isLoading, user, error} = state

  const run = React.useCallback(promise => {
    dispatch({type: 'fetching'})
    promise.then(
      recievedUser => dispatch({type: 'success', user: recievedUser}),
      error => dispatch({type: 'error', error}),
    )
  }, [])

  const hasUser = Boolean(user)
  React.useLayoutEffect(() => {
    if (!hasUser && auth.getToken()) {
      run(auth.getUser())
    }
  }, [hasUser, run])

  const login = React.useCallback(
    ({username, password}) => run(auth.login({username, password})),
    [run],
  )

  const register = React.useCallback(
    ({username, password}) => run(auth.register({username, password})),
    [run],
  )

  function logout() {
    auth.logout()
    dispatch({type: 'logout'})
  }

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      error,
      login,
      register,
      logout,
    }),
    [error, isLoading, login, register, user],
  )

  return value
}

function AuthProvider(props) {
  const value = useAuthContextValue()
  return <AuthContext.Provider value={value} {...props} />
}

function useAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export {AuthProvider, useAuth}
