import {Book} from './book'

export type Item = {
  id: string
  bookId: string
  ownerId: string
  rating: number
  notes: string
  startDate: number
  finishDate?: number
}

export type ItemAndBook = Item & {book: Book}
