import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import * as authClient from 'utils/auth-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {UserForm, User} from 'models/user'
import {useAsync} from 'utils/use-async'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

function App() {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData,
  } = useAsync<User | null>()

  React.useEffect(() => {
    run(authClient.getUser())
  }, [run, setData])

  function login(form: UserForm) {
    return authClient.login(form).then(u => setData(u))
  }

  function register(form: UserForm) {
    return authClient.register(form).then(u => setData(u))
  }

  function logout() {
    authClient.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError && error) {
    return <FullPageErrorFallback error={error} />
  }

  return (
    <>
      {user ? (
        <Router>
          <AuthenticatedApp user={user} logout={logout} />
        </Router>
      ) : (
        <UnauthenticatedApp login={login} register={register} />
      )}
    </>
  )
}

export {App}
