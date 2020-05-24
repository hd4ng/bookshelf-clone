/**@jsx jsx */
/**@jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {homepage} from '../package.json'
import {Button, FullPageErrorFallback, ErrorMessage} from 'components/lib'
import {ErrorBoundary} from 'react-error-boundary'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {DiscoverBooksScreen} from 'screens/discover'
import {BookScreen} from 'screens/book'
import {NotFoundScreen} from 'screens/not-found'

import {ReadingListScreen} from 'screens/reading-list'
import {FinishedScreen} from 'screens/finished'
import {useAuth} from 'context/auth-context'

const fullUrl = new URL(homepage)
const basename = fullUrl.pathname.endsWith('/')
  ? fullUrl.pathname.slice(0, fullUrl.pathname.length - 1)
  : fullUrl.pathname

function ErrorFallback({error}: {error?: Error}) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}

function AuthenticatedApp() {
  const {user, logout} = useAuth()
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      >
        {user?.username}
        <Button variant="secondary" css={{marginLeft: 10}} onClick={logout}>
          Logout
        </Button>
      </div>
      <div
        css={{
          margin: '0 auto',
          padding: '4em 2em',
          maxWidth: 840,
          width: '100%',
          display: 'grid',
          gridGap: '1em',
          gridTemplateColumns: '1fr 3fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',
          },
        }}
      >
        <div css={{position: 'relative'}}>
          <Nav />
        </div>
        <main css={{width: '100%'}}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}

function NavLink({children, to}: React.PropsWithChildren<{to: string}>) {
  const match = useMatch(to)
  return (
    <Link
      css={[
        {
          display: 'block',
          padding: '8px 15px 8px 10px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          color: colors.text,
          borderRadius: 2,
          borderLeft: '5px solid transparent',
          ':hover': {
            color: colors.indigo,
            textDecoration: 'none',
            backgroundColor: colors.gray10,
          },
        },
        match
          ? {
              borderColor: colors.indigo,
              backgroundColor: colors.gray10,
              ':hover': {
                backgroundColor: colors.gray10,
              },
            }
          : null,
      ]}
      to={to}
    >
      {children}
    </Link>
  )
}

function Nav() {
  return (
    <nav
      css={{
        position: 'sticky',
        top: 4,
        padding: '1em 1.5em',
        border: `1px solid ${colors.gray10}`,
        borderRadius: 3,
        [mq.small]: {
          position: 'static',
          top: 'auto',
        },
      }}
    >
      <ul css={{listStyle: 'none', padding: 0}}>
        <li>
          <NavLink to="/list">Reading List</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Book</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

function AppRoutes() {
  return (
    <Routes basename={basename}>
      <Route path="/list" element={<ReadingListScreen />} />
      <Route path="/finished" element={<FinishedScreen />} />
      <Route path="/discover" element={<DiscoverBooksScreen />} />
      <Route path="book/:bookId" element={<BookScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export default AuthenticatedApp
