import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { API_BASE_URL } from './apiservice/Apiservice'

declare global {
  interface Window {
    API_BASE_URL: string
  }
}

window.API_BASE_URL = API_BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
