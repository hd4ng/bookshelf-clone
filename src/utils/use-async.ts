import React from "react"
import { AsyncState, AsyncAction } from "./use-async.api"

function useSafeDispatch<T>(dispatch: React.Dispatch<T>) {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    ({ ...args }: T) => {
      mounted.current ? dispatch({ ...args }) : void 0
    },
    [dispatch]
  )
}

function useAsync<T>() {
  const initialState: AsyncState<T> = React.useMemo(
    () => ({
      status: "idle",
      data: null,
      error: null,
    }),
    []
  )

  const [{ status, data, error }, setState] = React.useReducer<
    React.Reducer<AsyncState<T>, AsyncAction<T>>
  >((s, a) => ({ ...s, ...a }), initialState)

  const safeSetState = useSafeDispatch<AsyncAction<T>>(setState)

  const run = React.useCallback(
    (promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error(
          "The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"
        )
      }

      safeSetState({ status: "pending" })
      return promise.then(
        (data) => {
          safeSetState({ data, status: "resolved" })
          return Promise.resolve(data)
        },
        (error) => {
          safeSetState({ status: "rejected", error })
          return Promise.reject(error)
        }
      )
    },
    [safeSetState]
  )

  const setData = React.useCallback((data: T) => safeSetState({ data }), [
    safeSetState,
  ])

  const setError = React.useCallback(
    (error: Error) => safeSetState({ error }),
    [safeSetState]
  )

  const reset = React.useCallback(() => safeSetState(initialState), [
    initialState,
    safeSetState,
  ])

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export { useAsync }
