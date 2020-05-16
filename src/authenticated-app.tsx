/**@jsx jsx */
/**@jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {Button} from 'components/lib'
import * as mq from 'styles/media-queries'
import {DiscoverBooksScreen} from 'screens/discover'

import {AuthenticatedAppProps} from 'authenticated-app.api'

function AuthenticatedApp({user, logout}: AuthenticatedAppProps) {
  return (
    <React.Fragment>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      >
        {user.username}
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
        <DiscoverBooksScreen />
      </div>
    </React.Fragment>
  )
}

export {AuthenticatedApp}
