import {useQuery, useMutation, MutationOptions, queryCache} from 'react-query'
import * as listItemsClient from './list-items-client'
import {UpdatedItem} from 'models/list-item'
import {setQueryDataForBook} from './books'
import {Book} from 'models/book'

function readListItems() {
  return listItemsClient.read().then(data => data.listItems)
}

function useListItems() {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: readListItems,
    config: {
      onSuccess: async listItems => {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return listItems ?? []
}

function useListItem(bookId: string) {
  const listItems = useListItems()
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutableOptions: MutationOptions<any, any> = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.refetchQueries('list-items'),
  useErrorBoundary: false,
  throwOnError: true,
}

function useUpdateListItem(options?: MutationOptions<any, any>) {
  return useMutation(
    (updates: UpdatedItem) => listItemsClient.update(updates.id, updates),
    {
      onMutate: newItem => {
        const previousItem = queryCache.getQueryData('list-items')

        queryCache.setQueryData(
          'list-items',
          (old?: Book[]) =>
            old?.map(item => {
              return item.id === newItem.id ? {...item, ...newItem} : item
            }) ?? [],
        )

        return () => queryCache.setQueryData('list-items', previousItem)
      },
      ...defaultMutableOptions,
      ...options,
    },
  )
}

function useRemoveListItem(options?: MutationOptions<any, any>) {
  return useMutation(({id}: {id: string}) => listItemsClient.remove(id), {
    onMutate: removeItem => {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', (old?: Book[]) => {
        return old?.filter(item => item.id !== removeItem.id) ?? []
      })

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutableOptions,
    ...options,
  })
}

function useCreateListItem(options?: MutationOptions<any, any>) {
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
