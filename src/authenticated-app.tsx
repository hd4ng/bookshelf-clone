/**@jsx jsx */
/**@jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {Button} from 'components/lib'
import * as mq from 'styles/media-queries'
import {DiscoverBooksScreen} from 'screens/discover'
import {AuthenticatedAppProps} from 'authenticated-app.api'

function AuthenticatedApp({logout}: AuthenticatedAppProps) {
  return <div />
}

export {AuthenticatedApp}
