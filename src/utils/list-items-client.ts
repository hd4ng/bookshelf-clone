import {client} from './api-client'
import {Book} from 'models/book'
import {Item} from 'models/list-item'

type ItemAndBook = Item & {book: Book}

function create(listItemData: {bookId: string}) {
  return client<{listItem: ItemAndBook}>('list-items', {data: listItemData})
}

function read() {
  return client<{listItems: ItemAndBook[]}>('list-items')
}

function update(
  listItemId: string,
  updates: Pick<Item, 'id'> & Partial<Omit<Item, 'id'>>,
) {
  return client<{listItem: ItemAndBook}>(`list-items/${listItemId}`, {
    method: 'PUT',
    data: updates,
  })
}

function remove(listItemId: string) {
  return client<{success: boolean}>(`list-items/${listItemId}`, {
    method: 'DELETE',
  })
}

export {create, read, update, remove}
