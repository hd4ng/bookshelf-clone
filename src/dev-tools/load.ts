function loadDevTools(callback: () => void): void {
  // check URL first
  const url = new URL(window.location.toString())
  const setInUrl = url.searchParams.has('dev-tools')
  const urlEnabled = url.searchParams.get('dev-tools') === 'true'
  if (setInUrl) {
    if (urlEnabled) {
      return go()
    } else {
      return callback()
    }
  }

  // the check localStorage
  const localStorageValue = window.localStorage.getItem('dev-tools')
  const setInLocalStorage = !!localStorageValue
  const localStorageEnabled = localStorageValue === 'true'

  if (setInLocalStorage) {
    if (localStorageEnabled) {
      return go()
    } else {
      return callback()
    }
  }

  // the default to turn it on if in development
  if (process.env.NODE_ENV === 'development') {
    return go()
  } else {
    return callback()
  }

  function go(): void {
    // use a dynamic import so the dev-tools code isn't bundled with the regular
    // app code so we don't worry about bundle size
    import('./dev-tools')
      .then(devTools => devTools.install())
      .finally(callback)
  }
}

export {loadDevTools}
