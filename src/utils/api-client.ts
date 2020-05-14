function client<T>(
  endpoint: RequestInfo,
  customConfig: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    method: "GET",
    ...customConfig,
  }
  return fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config).then(
    async (res) => {
      const data = await res.json()
      if (res.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    }
  )
}

export { client }
