export type UserForm = {
  username: string
  password: string
}
export type User = {
  id: string
  username: string
  passwordHash?: string
  token?: string
}

export type Users = {[key: string]: User}
