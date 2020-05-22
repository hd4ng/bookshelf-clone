import {queryCache} from 'react-query'
const localStorageKey = '__bookshelf_token__'

async function client<T>(
  endpoint: RequestInfo,
  {
    data,
    headers: customHeaders,
    ...customConfig
  }: RequestInit & {data?: any} = {},
): Promise<T> {
  // Ignore this... It's the *only* thing we need to do thanks to the way we
  // handle fetch requests with the service worker. In your app you shouldn't
  // need to have something like this
  await window.__bookshelf_serverReady

  // get the user's token from localstorage
  const token = window.localStorage.getItem(localStorageKey)

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...customHeaders,
    },
    ...customConfig,
  }

  if (token) {
    config.headers = {Authorization: `Bearer ${token}`}
  }

  if (data) {
    config.headers = {'Content-type': 'application/json'}
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async r => {
      if (r.status === 401) {
        logout()
        // refresh the page for them
        window.location.assign(window.location.toString())
        return Promise.reject({message: 'Please re-authenticate.'})
      }
      const data = await r.json()
      if (r.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

function logout() {
  queryCache.clear()
  window.localStorage.removeItem(localStorageKey)
}

export {client, localStorageKey, logout}
