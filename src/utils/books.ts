import {useQuery} from 'react-query'
import * as booksClient from './books-client'
import {loadingBook} from './book-placeholder'

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function searchBooks(queryKey: String, {query}: {query: string}) {
  return booksClient.search({query}).then(data => data.books)
}

function useBookSearch(query: string) {
  const result = useQuery(['bookSearch', {query}], searchBooks)
  return {...result, books: result.data ?? loadingBooks}
}

function getBook(queryKey: string, {bookId}: {bookId: string}) {
  return booksClient.read(bookId).then(data => data.book)
}

function useBook(bookId: string) {
  const {data} = useQuery(['book', {bookId}], getBook)
  return data ?? loadingBook
}

export {useBookSearch, useBook}