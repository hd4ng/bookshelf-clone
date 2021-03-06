/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {useParams} from 'react-router-dom'
import Tooltip from '@reach/tooltip'
import {FaRegCalendarAlt} from 'react-icons/fa'
import debounceFn from 'debounce-fn'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {useBook} from 'utils/books'
import {formatDate} from 'utils/misc'
import {useListItem, useUpdateListItem} from 'utils/list-items'
import {Rating} from 'components/rating'
import {StatusButtons} from 'components/status-buttons'
import {Textarea, Spinner} from 'components/lib'
import {ListItemTimeframeProps, NotesTextareaProps} from './book.api'

function BookScreen() {
  const {bookId} = useParams()
  const book = useBook(bookId)
  const listItem = useListItem(bookId)

  const {title, author, coverImageUrl, publisher, synopsis} = book

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{width: '100%', maxWidth: '14rem'}}
        />
        <div>
          <div css={{display: 'flex', position: 'relative'}}>
            <div css={{flex: 1, justifyContent: 'space-between'}}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}
            >
              {book.loadingBook ? null : <StatusButtons book={book} />}
            </div>
          </div>
          <div css={{marginTop: 10, height: 46}}>
            {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
            {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {!book.loadingBook && listItem ? (
        <NotesTextarea listItem={listItem} />
      ) : null}
    </div>
  )
}

function ListItemTimeframe({listItem}: ListItemTimeframeProps) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
        <span>
          {formatDate(listItem.startDate)}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

function NotesTextarea({listItem}: NotesTextareaProps) {
  const [mutate, {error, status}] = useUpdateListItem({throwOnError: false})
  const debounceMutate = React.useCallback(debounceFn(mutate, {wait: 300}), [])

  function handleNotesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    debounceMutate({id: listItem.id, notes: event.target.value})
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: 0,
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
        {status === 'loading' ? <Spinner /> : null}
        {error ? (
          <span role="alert" css={{color: colors.danger, fontSize: '0.7em'}}>
            <span>There was an error:</span>{' '}
            <pre
              css={{
                display: 'inline-block',
                overflow: 'scroll',
                margin: '0',
                marginBottom: -5,
              }}
            >
              {(error as Error).message}
            </pre>
          </span>
        ) : null}
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export {BookScreen}
