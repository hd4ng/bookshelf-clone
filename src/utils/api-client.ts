const localStorageKey = '__bookshelf_token__'

async function client<T>(
  endpoint: RequestInfo,
  {body, ...customConfig}: Omit<RequestInit, 'body'> & {body?: any} = {},
): Promise<T> {
  // Ignore this... It's the *only* thing we need to do thanks to the way we
  // handle fetch requests with the service worker. In your app you shouldn't
  // need to have something like this
  await window.__bookshelf_serverReady

  // get the user's token from localstorage
  const token = window.localStorage.getItem(localStorageKey)
  const headers: {[key: string]: string} = {
    'content-type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {...headers, ...customConfig.headers},
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  return fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(
    async res => {
      const data = await res.json()
      if (res.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    },
  )
}

export {client, localStorageKey}
