/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from "@emotion/core"
import { useState, useEffect } from "react"

import Tooltip from "@reach/tooltip"
import { FaSearch } from "react-icons/fa"
import { Input, BookListUL, Spinner } from "components/lib"
import { BookRow } from "components/book-row"
import * as booksClient from "utils/books-client"

import { Book } from "models/book"

const DiscoverBooksScreen = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const [data, setData] = useState<{ books: Book[] } | null>(null)
  const [query, setQuery] = useState("")
  const [queried, setQueried] = useState(false)

  const isLoading = status === "loading"
  const isSuccess = status === "success"

  useEffect(() => {
    if (!queried) {
      return
    }
    setStatus("loading")
    booksClient
      .search<{ books: Book[] }>({ query })
      .then((responseData) => {
        setData(responseData)
        setStatus("success")
      })
  }, [queried, query])

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault()
    setQueried(true)

    const elements = (event.target as HTMLFormElement).elements
    const search = elements.namedItem("search") as HTMLInputElement
    setQuery(search.value)
  }

  return (
    <div
      css={{ maxWidth: 800, margin: "auto", width: "90vw", padding: "40px 0" }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{ width: "100%" }}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: "0",
                position: "relative",
                marginLeft: "-35px",
                background: "transparent",
              }}
            >
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{ marginTop: "20" }}>
            {data.books.map((book) => (
              <li key={book.id}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>Noo books found. Try another search</p>
        )
      ) : null}
    </div>
  )
}

export { DiscoverBooksScreen }
