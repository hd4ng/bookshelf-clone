/**@jsx jsx */
/**@jsxFrag React.Fragment */
import {jsx, Global} from '@emotion/core'

import React from 'react'
import ReactDOM from 'react-dom'
import {FaTools} from 'react-icons/fa'
import {Tooltip} from '@reach/tooltip'
import * as reactQuery from 'react-query'

// pulling the development thing directly because I'm not worried about
// bundle size since this won't be loaded in prod unless the query string/localStorage key is set
import {ReactQueryDevtoolsPanel} from 'react-query-devtools'
function install() {
  // add some things to window to make it easier to debug
  window.reactQuery = reactQuery

  // @ts-ignore
  const requireDevToolsLocal = require.context(
    './',
    false,
    /dev-tools\.local\.js/,
  )
  const local = requireDevToolsLocal.keys()[0]
  if (local) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    requireDevToolsLocal(local).default
  }

  function DevTools(): React.ReactElement {
    const rootRef = React.useRef<HTMLDivElement | any>()
    const [hovering, setHovering] = React.useState(false)
    const [persist, setPersist] = React.useState(false)
    const show = persist || hovering

    function toggleShow() {
      setPersist(v => !v)
    }

    React.useEffect(() => {
      function updateHoverState(event: any) {
        setHovering(rootRef.current?.contains(event.target) ?? false)
      }
      document.body.addEventListener('mousemove', updateHoverState)
      return () =>
        document.body.removeEventListener('mousemove', updateHoverState)
    }, [])

    return (
      <div
        css={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div
          ref={rootRef}
          css={[
            {
              background: 'black',
              opacity: 0,
              color: 'white',
              padding: 20,
              height: 60,
              width: '100%',
              transition: 'all 0.3s',
              overflow: 'auto',
            },
            show ? {height: '50vh', width: '100%', opacity: 1} : null,
          ]}
        >
          <Tooltip label="Toggle Persist DevTools">
            <button
              css={{
                color: 'white',
                fontSize: '1.2rem',
                border: 'none',
                background: 'none',
                marginBottom: 10,
              }}
              onClick={toggleShow}
            >
              <FaTools />{' '}
              <span css={{fontWeight: persist ? 'bold' : 'normal'}}>
                Bookshelf DevTools
              </span>
            </button>
          </Tooltip>
          {show ? (
            <div>
              <div>
                <ClearLocalStorage />
                <EnableDevTools />
                <FailureRate />
                <RequestMinTime />
                <RequestVarTime />
              </div>
              <ReactQueryDevtoolsPanel />
            </div>
          ) : null}
        </div>
        {show ? <Global styles={{'#root': {marginBottom: '50vh'}}} /> : null}
      </div>
    )
  }

  // add dev tools UI to the page
  const devToolsRoot = document.createElement('div')
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(<DevTools />, devToolsRoot)
}

function ClearLocalStorage(): React.ReactElement {
  function clear() {
    window.localStorage.clear()
    window.location.assign(window.location.toString())
  }

  return <button onClick={clear}>Purge Database</button>
}

function FailureRate(): React.ReactElement {
  const [failureRate, setFailureRate] = useLocalStorageState(
    '__bookshelf_failure_rate__',
    0,
  )

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFailureRate(Number(event.target.value) / 100)
  }

  return (
    <div>
      <label htmlFor="failureRate">Request Failure Percentage: </label>
      <input
        css={{marginLeft: 6}}
        value={failureRate * 100}
        type="number"
        min="0"
        max="100"
        step="10"
        onChange={handleChange}
        id="failureRate"
      />
    </div>
  )
}

function EnableDevTools(): React.ReactElement {
  const [enableDevTools, setEnableDevTools] = useLocalStorageState(
    'dev-tools',
    process.env.NODE_ENV === 'development',
  )

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEnableDevTools(event.target.checked)
  }

  return (
    <div>
      <input
        css={{marginRight: 6}}
        checked={enableDevTools}
        type="checkbox"
        onChange={handleChange}
        id="enableDevTools"
      />
      <label htmlFor="enableDevTools">Enable DevTools by default</label>
    </div>
  )
}

function RequestMinTime(): React.ReactElement {
  const [minTime, setMinTime] = useLocalStorageState(
    '__bookshelf_min_request_time__',
    400,
  )

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMinTime(Number(event.target.value))
  }

  return (
    <div>
      <label htmlFor="minTime">Request min time (ms): </label>
      <input
        css={{marginLeft: 6}}
        value={minTime}
        type="number"
        step="100"
        min="0"
        max={1000 * 60}
        onChange={handleChange}
        id="minTime"
      />
    </div>
  )
}

function RequestVarTime(): React.ReactElement {
  const [varTime, setVarTime] = useLocalStorageState(
    '__bookshelf_variable_request_time__',
    400,
  )

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setVarTime(Number(event.target.value))
  }

  return (
    <div>
      <label htmlFor="varTime">Request variable time (ms): </label>
      <input
        css={{marginLeft: 6}}
        value={varTime}
        type="number"
        step="100"
        min="0"
        max={1000 * 60}
        onChange={handleChange}
        id="varTime"
      />
    </div>
  )
}

/**
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */
function useLocalStorageState(
  key: string,
  defaultValue: any = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
  }, [key])

  React.useEffect(() => {
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

export {install}
