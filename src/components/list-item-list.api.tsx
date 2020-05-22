import {ItemAndBook} from 'models/list-item'

export type ListItemListProps = {
  filterListItems: (item: ItemAndBook) => boolean
  noListItems: React.ReactNode
  noFilteredListItems: React.ReactNode
}
