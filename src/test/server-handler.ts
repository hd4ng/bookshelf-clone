import {rest, MockedRequest} from 'msw'
import * as booksDB from './data/books'
import * as usersDB from './data/users'
import {ResponseComposition} from 'msw/lib/types/response'

let sleep: () => Promise<any>
if (process.env.NODE_ENV === 'test') {
  sleep = () => Promise.resolve()
} else {
  sleep = (
    t = Math.random() * ls('__bookshelf_variable_request_time__', 400) +
      ls('__bookshelf_min_request_time__', 400),
  ) => new Promise(resolve => setTimeout(resolve, t))
}

function ls(key: string, defaultVal: number) {
  const lsVal = window.localStorage.getItem(key)
  let val = defaultVal
  if (lsVal) {
    val = Number(lsVal)
  }
  return Number.isFinite(val) ? val : defaultVal
}

const apiUrl = process.env.REACT_APP_API_URL

const handlers = [
  rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
    const user = getUser(req)
    return res(ctx.json({user}))
  }),

  rest.post(`${apiUrl}/login`, async (req, res, ctx) => {
    const {username, password} = req.body as {
      username?: string
      password?: string
    }
    const user = usersDB.authenticate({username, password})
    return res(ctx.json({user}))
  }),

  rest.post(`${apiUrl}/register`, async (req, res, ctx) => {
    const {username, password} = req.body as {
      username?: string
      password?: string
    }
    const userFields = {username, password}
    usersDB.create(userFields)
    let user
    try {
      user = usersDB.authenticate(userFields)
    } catch (error) {
      return res(ctx.status(400), ctx.json({message: error.message}))
    }
    return res(ctx.json({user}))
  }),

  rest.get(`${apiUrl}/books`, async (req, res, ctx) => {
    if (!req.query.has('query')) {
      return ctx.fetch(req)
    }
    const query = req.query.get('query')

    let matchingBooks = []
    if (query) {
      matchingBooks = booksDB.query(query)
    } else {
      matchingBooks = booksDB.readManyNotInList([]).slice(0, 10)
    }

    return res(ctx.json({books: matchingBooks}))
  }),

  rest.get(`${apiUrl}/books/:bookId`, async (req, res, ctx) => {
    const {bookId} = req.params
    const book = booksDB.read(bookId)
    if (!book) {
      return res(ctx.status(404), ctx.json({message: 'Book not found'}))
    }

    return res(ctx.json({book}))
  }),

  rest.post(`${apiUrl}/profile`, async (req, res, ctx) => {
    // here's where we'd actually send the report to some real data store
    return res(ctx.json({success: true}))
  }),
].map(handler => {
  return {
    ...handler,
    async resolver(req: MockedRequest, res: ResponseComposition, ctx: any) {
      try {
        const result = await handler.resolver(req, res, ctx)
        if (shouldFail(req)) {
          throw new Error('Random failure (for testing purposes). Try again.')
        }
        return result
      } catch (error) {
        return res(
          ctx.status(error.status || 500),
          ctx.json({message: error.message || 'Unknown Error'}),
        )
      } finally {
        await sleep()
      }
    },
  }
})

function shouldFail(req: MockedRequest) {
  if (JSON.stringify(req.body)?.includes('FAIL')) return true
  if (req.query.toString()?.includes('FAIL')) return true
  if (process.env.NODE_ENV === 'test') return false
  const failureRate = Number(
    window.localStorage.getItem('__bookshelf_failure_rate__') || 0,
  )

  return Math.random() < failureRate
}

const getToken = (req: MockedRequest) =>
  req.headers.get('Authorization')?.replace('Bearer ', '')

function getUser(req: MockedRequest) {
  const token = getToken(req)
  if (!token) {
    const error: Error & {status?: number} = new Error(
      'A token must be provided',
    )
    error.status = 401
    throw error
  }
  let userId
  try {
    userId = atob(token)
  } catch (e) {
    const error: Error & {status?: number} = new Error(
      'Invalid token. Please login again.',
    )
    error.status = 401
    throw error
  }
  return usersDB.read(userId)
}

export {handlers}
