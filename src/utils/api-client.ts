function client<T>(
  endpoint: RequestInfo,
  customConfig: RequestInit = { method: "GET" }
): Promise<T> {
  return fetch(
    `${process.env.REACT_APP_API_URL}/${endpoint}`,
    customConfig
  ).then((res) => res.json())
}

export { client }
