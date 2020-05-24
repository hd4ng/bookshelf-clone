import {client, localStorageKey} from './api-client'
import {User, UserForm} from 'models/user'

function handleUserResponse({user: {token, ...user}}: {user: User}) {
  window.localStorage.setItem(localStorageKey, token as string)
  return user
}

function getUser(): Promise<User | null> {
  const token = getToken()
  if (!token) {
    return Promise.resolve(null)
  }
  return client<{user: User}>('me').then(data => data.user)
}

function login({username, password}: UserForm) {
  return client<{user: User}>('login', {data: {username, password}}).then(
    handleUserResponse,
  )
}

function register({username, password}: UserForm) {
  return client<{user: User}>('register', {data: {username, password}}).then(
    handleUserResponse,
  )
}

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function isLoggedIn() {
  return Boolean(getToken())
}

export {logout} from './api-client'
export {login, register, getUser, isLoggedIn}
