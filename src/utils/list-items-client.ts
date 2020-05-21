import {client} from './api-client'

function create(listItemData: any) {
  return client('list-items', {body: listItemData})
}

function read() {
  return client('list-items')
}

function update(listItemId: string, updates: any) {
  return client(`list-items/${listItemId}`, {
    method: 'PUT',
    body: updates,
  })
}

function remove(listItemId: string) {
  return client(`list-items/${listItemId}`, {method: 'DELETE'})
}

export {create, read, update, remove}
