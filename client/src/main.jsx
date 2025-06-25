import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext'
import { ThemeModeProvider } from './context/ThemeContext'
import { ChatBotProvider } from './components/ChatBot/ChatBotProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeModeProvider>
      <UserProvider>
        <ChatBotProvider>
          <App />
        </ChatBotProvider>
      </UserProvider>
    </ThemeModeProvider>
  </StrictMode>,
)
