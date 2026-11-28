import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Fonts are self-hosted on the site (/brain-candy/fonts/); anywhere else the page falls back to system fonts.
const fonts = document.createElement('link')
fonts.rel = 'stylesheet'
fonts.href = '/brain-candy/fonts/fonts.css'
document.head.appendChild(fonts)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
