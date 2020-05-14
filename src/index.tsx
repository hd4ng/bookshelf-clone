import React from "react"
import ReactDOM from "react-dom"

import "./bootstrap"
import { DiscoverBooksScreen } from "screens/discover"

ReactDOM.render(
  <React.StrictMode>
    <DiscoverBooksScreen />
  </React.StrictMode>,
  document.getElementById("root")
)
