import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { App } from './App'

// Ensure browser tab title is updated immediately
document.title = "ORCA — ISRO Marine EcOsystem Reasoning with Collaborative Agents";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
