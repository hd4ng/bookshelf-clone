import {useQuery, queryCache} from 'react-query'
import * as booksClient from './books-client'
import {loadingBook} from './book-placeholder'
import {Book} from 'models/book'

const loadingBooks: Book[] = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function searchBooks(queryKey: string, {query}: {query: string}) {
  return booksClient.search({query}).then(data => data.books)
}

function useBookSearch(query: string) {
  const result = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: searchBooks,
    config: {
      onSuccess(books) {
        for (const book of books) {
          setQueryDataForBook(book)
        }
      },
    },
  })
  return {...result, books: result.data ?? loadingBooks}
}

function getBook(queryKey: string, {bookId}: {bookId: string}) {
  return booksClient.read(bookId).then(data => data.book)
}

function useBook(bookId: string) {
  const {data} = useQuery(['book', {bookId}], getBook)
  return data ?? {...loadingBook, id: 'loading-book'}
}

function setQueryDataForBook(book: Book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

async function refetchBookSearchQuery() {
  queryCache.removeQueries('bookSearch')
  await queryCache.prefetchQuery({
    queryKey: ['bookSearch', {query: ''}],
    queryFn: searchBooks,
    config: {
      onSuccess(books) {
        for (const book of books) {
          setQueryDataForBook(book)
        }
      },
    },
  })
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook}
