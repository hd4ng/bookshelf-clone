import {User} from 'models/user'

export type AuthenticatedAppProps = {
  user: User
  logout: () => void
}
