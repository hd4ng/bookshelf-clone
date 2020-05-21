import * as booksDB from './books'

type Item = {
  id: string
  ownerId: string
  bookId: string
  rating: number
  notes: string
  finishDate?: number
  startDate: number
}

const listItemsKey = '__bookshelf_list_items__'
const listItems: {
  [key: string]: Item
} = {}

function persist() {
  window.localStorage.setItem(listItemsKey, JSON.stringify(listItems))
}

function load() {
  return Object.assign(
    listItems,
    JSON.parse(window.localStorage.getItem(listItemsKey) as string),
  )
}

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

window.__bookshelf = window.__bookshelf || {}
window.__bookshelf.purgeListItems = () => {
  Object.keys(listItems).forEach(key => {
    delete listItems[key]
  })

  persist()
}

function authorize(userId: string, listItemId: string) {
  const listItem = read(listItemId)
  if (listItem.ownerId !== userId) {
    const error: Error & {status?: number} = new Error(
      'User is not authorized to view that list',
    )
    error.status = 403
    throw error
  }
}

function create({
  bookId,
  ownerId,
  rating = -1,
  notes = '',
  startDate = Date.now(),
  finishDate = undefined,
}: {
  bookId: string
  ownerId: string
  rating?: number
  notes?: string
  startDate?: number
  finishDate?: number
}) {
  const id = hash(`${bookId}${ownerId}`)
  if (listItems[id]) {
    const error: Error & {status?: number} = new Error(
      'This user cannot create new list item for that book',
    )
    error.status = 400
    throw error
  }

  const book = booksDB.read(bookId)
  if (!book) {
    const error: Error & {status?: number} = new Error(
      `No book found with the ID of ${bookId}`,
    )
    error.status = 400
    throw error
  }
  listItems[id] = {id, bookId, ownerId, rating, notes, finishDate, startDate}
  return read(id)
}

function read(id: string) {
  validateListItem(id)
  return listItems[id]
}

function update(id: string, updates: any) {
  validateListItem(id)
  Object.assign(listItems[id], updates)
  persist()
  return read(id)
}

function remove(id: string) {
  validateListItem(id)
  delete listItems[id]
  persist()
}

function readMany(userId: string, listItemIds: string[]) {
  return listItemIds.map(id => {
    authorize(userId, id)
    return read(id)
  })
}

function readByOwner(userId: string) {
  return Object.values(listItems).filter((li: any) => li.ownerId === userId)
}

function validateListItem(id: string) {
  load()
  if (!listItems[id]) {
    const error: Error & {status?: number} = new Error(
      `No list item with the id "${id}"`,
    )
    error.status = 404
    throw error
  }
}

function hash(str: string) {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

function require(key: string) {
  const error: Error & {status?: number} = new Error(`${key} is required`)
  error.status = 400
  throw error
}

export {authorize, create, read, update, remove, readMany, readByOwner}
