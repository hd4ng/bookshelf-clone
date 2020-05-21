import {client} from './api-client'
import {Book} from 'models/book'
import {Item} from 'models/list-item'

type ItemAndBook = Item & {book: Book}

function create(listItemData: any) {
  return client<{listItem: ItemAndBook}>('list-items', {body: listItemData})
}

function read() {
  return client<{listItems: ItemAndBook[]}>('list-items')
}

function update(listItemId: string, updates: any) {
  return client<{listItem: ItemAndBook}>(`list-items/${listItemId}`, {
    method: 'PUT',
    body: updates,
  })
}

function remove(listItemId: string) {
  return client<{success: boolean}>(`list-items/${listItemId}`, {
    method: 'DELETE',
  })
}

export {create, read, update, remove}
