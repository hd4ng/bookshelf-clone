export type AsyncState<T> = {
  status: "idle" | "pending" | "rejected" | "resolved"
  data: T | null
  error: Error | null
}

export type AsyncAction<T> = Partial<AsyncState<T>>
