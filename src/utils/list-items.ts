import {useQuery, useMutation, MutationOptions} from 'react-query'
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

const defaultMutableOptions: MutationOptions<any, any> = {
  useErrorBoundary: false,
  throwOnError: true,
}

function useUpdateListItem(
  options?: Pick<
    MutationOptions<any, any>,
    'useErrorBoundary' | 'throwOnError'
  >,
) {
  return useMutation(
    (updates: Pick<Item, 'id'> & Partial<Omit<Item, 'id'>>) =>
      listItemsClient.update(updates.id, updates),
    {...defaultMutableOptions, ...options},
  )
}

function useRemoveListItem(
  options?: Pick<
    MutationOptions<any, any>,
    'useErrorBoundary' | 'throwOnError'
  >,
) {
  return useMutation(({id}: {id: string}) => listItemsClient.remove(id), {
    ...defaultMutableOptions,
    ...options,
  })
}

function useCreateListItem(
  options?: Pick<
    MutationOptions<any, any>,
    'useErrorBoundary' | 'throwOnError'
  >,
) {
  return useMutation(
    ({bookId}: {bookId: string}) => listItemsClient.create({bookId}),
    {...defaultMutableOptions, ...options},
  )
}

export {
  useCreateListItem,
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
}
