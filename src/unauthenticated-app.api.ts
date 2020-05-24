import {UserForm} from 'models/user'

export type LoginFormProps = {
  onSubmit: ({username, password}: UserForm) => Promise<void>
  submitButton: React.ReactElement
}
