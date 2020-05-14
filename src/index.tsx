import { loadDevTools } from "dev-tools/load"
import "./bootstrap"
import React from "react"
import ReactDOM from "react-dom"

import { DiscoverBooksScreen } from "screens/discover"

loadDevTools(() => {
  ReactDOM.render(
    <React.StrictMode>
      <DiscoverBooksScreen />
    </React.StrictMode>,
    document.getElementById("root")
  )
})
