import { rest, MockedRequest } from "msw"
import * as booksDB from "./data/books"
import { ResponseComposition } from "msw/lib/types/response"

let sleep: () => Promise<any>
if (process.env.NODE_ENV === "test") {
  sleep = () => Promise.resolve()
} else {
  sleep = (
    t = Math.random() * ls("__bookshelf_variable_request_time__", 400) +
      ls("__bookshelf_min_request_time__", 400)
  ) => new Promise((resolve) => setTimeout(resolve, t))
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
  rest.get(`${apiUrl}/books`, async (req, res, ctx) => {
    if (!req.query.has("query")) {
      return ctx.fetch(req)
    }
    const query = req.query.get("query")

    let matchingBooks = []
    if (query) {
      matchingBooks = booksDB.query(query)
    } else {
      matchingBooks = booksDB.readManyNotInList([]).slice(0, 10)
    }

    return res(ctx.json({ books: matchingBooks }))
  }),

  rest.get(`${apiUrl}/books/:bookId`, async (req, res, ctx) => {
    const { bookId } = req.params
    const book = booksDB.read(bookId)
    if (!book) {
      return res(ctx.status(404), ctx.json({ message: "Book not found" }))
    }

    return res(ctx.json({ book }))
  }),
].map((handler) => {
  return {
    ...handler,
    async resolver(req: MockedRequest, res: ResponseComposition, ctx: any) {
      try {
        const result = await handler.resolver(req, res, ctx)
        if (shouldFail(req)) {
          throw new Error("Random failure (for testing purposes). Try again.")
        }
        return result
      } catch (error) {
        return res(
          ctx.status(error.status || 500),
          ctx.json({ message: error.message || "Unknown Error" })
        )
      } finally {
        await sleep()
      }
    },
  }
})

function shouldFail(req: MockedRequest) {
  if (JSON.stringify(req.body)?.includes("FAIL")) return true
  if (req.query.toString()?.includes("FAIL")) return true
  if (process.env.NODE_ENV === "test") return false
  const failureRate = Number(
    window.localStorage.getItem("__bookshelf_failure_rate__") || 0
  )

  return Math.random() < failureRate
}

export { handlers }
