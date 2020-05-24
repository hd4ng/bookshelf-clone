import {User, UserForm} from 'models/user'

export type IAuthContext = {
  user: User
  register: (form: UserForm) => Promise<void>
  login: (form: UserForm) => Promise<void>
  logout: () => void
}
