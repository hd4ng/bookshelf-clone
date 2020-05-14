import allBooks from "./books-data.json"
import matchSorter from "match-sorter"
import { Book } from "models/book"

function create(book: Book): Book {
  allBooks.push(book)
  return book
}

function read(bookId: string): Book | undefined {
  return allBooks.find((book) => book.id === bookId)
}

function readManyNotInList(ids: string[]): Book[] {
  return allBooks.filter((book) => !ids.includes(book.id))
}

function query(search: string): Book[] {
  return matchSorter(allBooks as Book[], search, {
    keys: [
      "title",
      "author",
      "publisher",
      { threshold: matchSorter.rankings.CONTAINS, key: "synopsis" },
    ],
  })
}

export { create, read, readManyNotInList, query }
