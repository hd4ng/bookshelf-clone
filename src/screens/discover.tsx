/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from 'components/lib'
import {BookRow} from 'components/book-row'
import {useBookSearch, refetchBookSearchQuery} from 'utils/books'

const DiscoverBooksScreen = () => {
  const [query, setQuery] = React.useState('')
  const [hasSearched, setHasSearched] = React.useState(false)
  const {books, error, status} = useBookSearch(query)

  const isLoading = status === 'loading'
  const isError = status === 'error'
  const isSuccess = status === 'success'

  React.useEffect(() => {
    return () => {
      refetchBookSearchQuery()
    }
  }, [])

  function handleSearchClick(event: React.FormEvent) {
    event.preventDefault()

    const elements = (event.target as HTMLFormElement).elements
    const search = elements.namedItem('search') as HTMLInputElement
    setHasSearched(true)
    setQuery(search.value)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <Input
            placeholder="Search books..."
            id="search"
            css={{width: '100%'}}
          />
          <Tooltip label="Search Books">
            <label htmlFor="search">
              <button
                type="submit"
                css={{
                  border: '0',
                  position: 'relative',
                  marginLeft: '-35px',
                  background: 'transparent',
                }}
              >
                {isLoading ? (
                  <Spinner />
                ) : isError ? (
                  <FaTimes aria-label="error" css={{color: 'red'}} />
                ) : (
                  <FaSearch aria-label="search" />
                )}
              </button>
            </label>
          </Tooltip>
        </form>

        {isError ? (
          <div css={{color: 'red'}}>
            <p>There was an error:</p>
            <pre>{(error as Error).message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        {hasSearched ? null : (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few books for you...</p>
            {isLoading ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : isSuccess && books.length ? (
              <p>Here you go! Find more books with the search bar above.</p>
            ) : isSuccess && !books.length ? (
              <p>
                Hmmm... I couldn't find any books to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}
        {books.length ? (
          <BookListUL css={{marginTop: 20}}>
            {books.map(book => (
              <li key={book.id}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : hasSearched ? (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            {isLoading ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : (
              <p>
                Hmmm... I couldn't find any books with the query "{query}."
                Please try another.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export {DiscoverBooksScreen}
