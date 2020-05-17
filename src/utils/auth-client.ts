import {client, localStorageKey} from './api-client'
import {User, UserForm} from 'models/user'

function handleUserResponse({user: {token, ...user}}: {user: User}) {
  window.localStorage.setItem(localStorageKey, token as string)
  return user
}

function login({username, password}: UserForm) {
  return client<{user: User}>('login', {body: {username, password}}).then(
    handleUserResponse,
  )
}

function register({username, password}: UserForm) {
  return client<{user: User}>('register', {body: {username, password}}).then(
    handleUserResponse,
  )
}

function logout() {
  window.localStorage.removeItem(localStorageKey)
}

export {login, register, logout}
