/// <reference types="react-scripts" />

declare var __bookshelf_serverReady: Promise<void>
declare var reactQuery
declare var __bookshelf: {
  purgeUsers?: () => void
  purgeListItems?: () => void
}
declare module 'react-query-devtools'
