import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext'
import { ThemeModeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeModeProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeModeProvider>
  </StrictMode>,
)
