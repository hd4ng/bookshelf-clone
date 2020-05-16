/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'
import 'bootstrap/dist/css/bootstrap-reboot.css'

import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'

import {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContents,
} from 'components/modal'
import Logo from 'components/logo'
import {Button, CircleButton, FormGroup, Input, Spinner} from 'components/lib'

import '@reach/dialog/styles.css'

const App = () => {
  const login = (formData: {username: string; password: string}) => {
    console.log('login', formData)
  }

  const register = (formData: {username: string; password: string}) => {
    console.log('register', formData)
  }

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Logo width={80} height={80} />
      <h1>Bookshelf</h1>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridGap: '0.75rem',
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form">
            {circleDismissButton}
            <h3 css={{textAlign: 'center', fontSize: '2em'}}>Login</h3>
            <LoginForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form">
            {circleDismissButton}
            <h3 css={{textAlign: 'center', fontSize: '2em'}}>Register</h3>
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

type LoginFormProps = {
  onSubmit: ({username, password}: {username: string; password: string}) => void
  submitButton: React.ReactElement
}

const LoginForm: React.FC<LoginFormProps> = ({onSubmit, submitButton}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const elements = (event.target as HTMLFormElement).elements
    const username = elements.namedItem('username') as HTMLInputElement
    const password = elements.namedItem('password') as HTMLInputElement

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }
  return (
    <form
      onSubmit={handleSubmit}
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
    >
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input type="text" id="username" autoComplete="off" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input type="password" id="password" autoComplete="off" />
      </FormGroup>
      <div>
        {React.cloneElement(submitButton, {type: 'submit'})}
        <Spinner css={{marginLeft: 5}} />
      </div>
    </form>
  )
}

const circleDismissButton = (
  <div css={{display: 'flex', justifyContent: 'flex-end'}}>
    {' '}
    <ModalDismissButton>
      <CircleButton>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </CircleButton>
    </ModalDismissButton>
  </div>
)

export default App
