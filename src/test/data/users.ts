import {Users, User} from 'models/user'

const usersKey = '__bookshelf_users__'
const users: Users = {}
const persist = () =>
  window.localStorage.setItem(usersKey, JSON.stringify(users))

const load = () =>
  Object.assign(
    users,
    JSON.parse(window.localStorage.getItem(usersKey) as string),
  )

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

window.__bookshelf = window.__bookshelf || {}
window.__bookshelf.purgeUsers = () => {
  Object.keys(users).forEach(key => {
    delete users[key]
  })
  persist()
}

function validateUserForm({
  username,
  password,
}: {
  username?: string
  password?: string
}) {
  if (!username) {
    const error: Error & {code?: number} = new Error('A username is required')
    error.code = 400
    throw error
  }
  if (!password) {
    const error: any = new Error('A password is required')
    // TODO: create new issue for Kent. He uses code and status for error number
    error.code = 400
    throw error
  }
}

function authenticate({
  username,
  password,
}: {
  username?: string
  password?: string
}) {
  validateUserForm({username, password})
  const id = hash(username || '')
  const user = users[id] || {}
  if (user.passwordHash === hash(password || '')) {
    return {...user, token: btoa(user.id)}
  }
  const error: any = new Error('Invalid username or password')
  error.status = 400
  throw error
}

function create({username, password}: {username?: string; password?: string}) {
  validateUserForm({username, password})
  const id = hash(username || '')
  const passwordHash = hash(password || '')
  if (users[id]) {
    const error: any = new Error(
      `Cannot create a new user with the user name "${username}"`,
    )
    // TODO: create new issue for Kent
    error.status = 400
    throw error
  }
  users[id] = {id, username: username || '', passwordHash}
  persist()
}

function read(id: string) {
  validateUser(id)
  const {passwordHash, ...user} = users[id]
  return user
}

function update(id: string, updates: User) {
  validateUser(id)
  Object.assign(users[id], updates)
  persist()
  return read(id)
}

// this would be called `delete` except that's a reserved word in JS
function remove(id: string) {
  validateUser(id)
  delete users[id]
  persist()
}

function validateUser(id: string) {
  load()
  if (!users[id]) {
    const error: any = new Error(`No user with the id "${id}"`)
    error.status = 404
    throw error
  }
}

function hash(str: string): string {
  let hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  return String(hash >>> 0)
}

export {authenticate, create, read, update, remove}
