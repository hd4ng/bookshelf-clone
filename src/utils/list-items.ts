import {useQuery, useMutation} from 'react-query'
import * as listItemsClient from './list-items-client'
import {Item} from 'models/list-item'

function readListItems() {
  return listItemsClient.read().then(data => data.listItems)
}

function useListItems() {
  const {data} = useQuery('list-items', readListItems)
  return data ?? []
}

function useListItem(bookId: string) {
  const listItems = useListItems()
  return listItems.find(li => li.bookId === bookId) ?? null
}

function useUpdateListItem() {
  return useMutation((updates: Pick<Item, 'id'> & Partial<Omit<Item, 'id'>>) =>
    listItemsClient.update(updates.id, updates),
  )
}

function useRemoveListItem() {
  return useMutation(({id}: {id: string}) => listItemsClient.remove(id))
}

function useCreateListItem() {
  return useMutation(({bookId}: {bookId: string}) =>
    listItemsClient.create({bookId}),
  )
}

export {
  useCreateListItem,
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
}
