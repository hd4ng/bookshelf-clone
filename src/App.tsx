import React from 'react'
import * as authClient from 'utils/auth-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {UserForm, User} from 'models/user'

function App() {
  const [user, setUser] = React.useState<User | null>()

  React.useEffect(() => {
    authClient.getUser().then(u => setUser(u))
  }, [])

  function login(form: UserForm) {
    return authClient.login(form).then(u => setUser(u))
  }

  function register(form: UserForm) {
    return authClient.register(form).then(u => setUser(u))
  }

  function logout() {
    authClient.logout()
    setUser(undefined)
  }

  return (
    <>
      {user ? (
        <AuthenticatedApp user={user} logout={logout} />
      ) : (
        <UnauthenticatedApp login={login} register={register} />
      )}
    </>
  )
}

export {App}
