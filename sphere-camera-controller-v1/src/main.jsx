import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FirstLevel from './levels/FirstLevel.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirstLevel />
  </StrictMode>,
)
