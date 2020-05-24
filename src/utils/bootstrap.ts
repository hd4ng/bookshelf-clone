import {queryCache} from 'react-query'
import * as auth from './auth-client'
import * as listItemsClient from './list-items-client'
import {User} from 'models/user'
import {ItemAndBook} from 'models/list-item'

async function bootstrapAppData() {
  let appData: {user: User | null; listItems: ItemAndBook[] | null} = {
    user: null,
    listItems: [],
  }

  if (auth.isLoggedIn()) {
    const [user, listItems] = await Promise.all([
      auth.getUser(),
      listItemsClient.read().then(d => d.listItems),
    ])
    appData = {user, listItems}
  }
  queryCache.setQueryData('list-items', appData.listItems)
  return appData
}

export {bootstrapAppData}
