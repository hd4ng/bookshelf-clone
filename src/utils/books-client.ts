import { client } from "./api-client"

function search<T>({ query }: { query: string }) {
  return client<T>(`books?query=${encodeURIComponent(query)}`)
}

export { search }
