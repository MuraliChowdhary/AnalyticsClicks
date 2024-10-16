// src/index.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {
  FpjsProvider
} from '@fingerprintjs/fingerprintjs-pro-react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FpjsProvider
      loadOptions={{
        apiKey: "hqM2WbFkZDheF8d2LL0p",
        region: "ap"
      }}
    >
      <App />
    </FpjsProvider>
  </React.StrictMode>
)