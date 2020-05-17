import {client} from './api-client'
import {Book} from 'models/book'

function search({query}: {query: string}) {
  return client<{
    books: Book[]
  }>(`books?query=${encodeURIComponent(query)}`)
}

function read(bookId: string) {
  return client<{book: Book}>(`books/${bookId}`)
}

export {search, read}
