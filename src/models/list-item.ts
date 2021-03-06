import {Book} from './book'

export type Item = {
  id: string
  bookId: string
  ownerId: string
  rating: number
  notes: string
  startDate: number
  finishDate?: number | null
}

export type ItemAndBook = Item & {book: Book}

export type UpdatedItem = Pick<Item, 'id'> & Partial<Omit<Item, 'id'>>
