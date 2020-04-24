import React, { useState } from "react"
import Dialog from "@reach/dialog"

import Logo from "./components/logo"
import "@reach/dialog/styles.css"

const App = () => {
  const [openModal, setOpenModal] = useState<"none" | "login" | "register">(
    "none"
  )

  const login = (formData: { username: string; password: string }) => {
    console.log("login", formData)
  }

  const register = (formData: { username: string; password: string }) => {
    console.log("register", formData)
  }

  return (
    <div>
      <Logo width={80} height={80} />
      <h1>BookShelf</h1>
      <div>
        <button onClick={() => setOpenModal("login")}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenModal("register")}>Register</button>
      </div>

      <Dialog aria-label="Login Form" isOpen={openModal === "login"}>
        <div>
          <button onClick={() => setOpenModal("none")}>Close</button>
        </div>
        <LoginForm buttonText="Login" onSubmit={login} />
      </Dialog>

      <Dialog aria-label="Register Form" isOpen={openModal === "register"}>
        <div>
          <button onClick={() => setOpenModal("none")}>Close</button>
        </div>
        <LoginForm buttonText="Register" onSubmit={register} />
      </Dialog>
    </div>
  )
}

const LoginForm: React.FC<{
  onSubmit: ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => void
  buttonText: string
}> = ({ onSubmit, buttonText }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const elements = (event.target as HTMLFormElement).elements
    const username = elements.namedItem("username") as HTMLInputElement
    const password = elements.namedItem("password") as HTMLInputElement

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }
  return (
    <>
      <h3>{buttonText}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <div>
          <button type="submit">{buttonText}</button>
        </div>
      </form>
    </>
  )
}

export default App
