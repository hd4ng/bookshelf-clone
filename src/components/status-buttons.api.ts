import {Book} from 'models/book'

export type TooltipButtonProps = {
  label: string
  highlight: string
  onClick: () => Promise<any>
  icon: React.ReactElement
}

export type StatusButtonsProps = {
  book: Book
}
