import {client} from './api-client'
import {Book} from 'models/book'

function search({query}: {query: string}) {
  return client<{
    books: Book[]
  }>(`books?query=${encodeURIComponent(query)}`)
}

export {search}
