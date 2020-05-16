import {UserForm} from 'models/user'

export type UnauthenticatedAppProps = {
  login: (form: UserForm) => void
  register: (form: UserForm) => void
}
