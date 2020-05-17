import {UserForm} from 'models/user'

export type UnauthenticatedAppProps = {
  login: (form: UserForm) => Promise<void>
  register: (form: UserForm) => Promise<void>
}

export type LoginFormProps = {
  onSubmit: ({username, password}: UserForm) => Promise<void>
  submitButton: React.ReactElement
}
