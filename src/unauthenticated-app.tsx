/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'

import {Modal, ModalOpenButton, ModalContents} from 'components/modal'
import {Logo} from 'components/logo'
import {Button, FormGroup, Input, Spinner, ErrorMessage} from 'components/lib'

import {LoginFormProps} from 'unauthenticated-app.api'
import 'bootstrap/dist/css/bootstrap-reboot.css'
import '@reach/dialog/styles.css'
import {useAsync} from 'utils/use-async'
import {useAuth} from 'context/auth-context'

function UnauthenticatedApp() {
  const {login, register} = useAuth()
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
          <ModalContents aria-label="Login form" title="Login">
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
          <ModalContents aria-label="Registration form" title="Register">
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

function LoginForm({onSubmit, submitButton}: LoginFormProps) {
  const {isLoading, isError, error, run} = useAsync()
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const elements = (event.target as HTMLFormElement).elements
    const username = elements.namedItem('username') as HTMLInputElement
    const password = elements.namedItem('password') as HTMLInputElement

    run(
      onSubmit({
        username: username.value,
        password: password.value,
      }),
    )
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
        {React.cloneElement(
          submitButton,
          {type: 'submit'},
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
          isLoading ? <Spinner css={{marginLeft: 5}} /> : null,
        )}
      </div>
      {isError ? <ErrorMessage error={error as Error} /> : null}
    </form>
  )
}

export {UnauthenticatedApp}
