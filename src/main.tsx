import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@descope/react-sdk';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <AuthProvider projectId="P2svDaVml78jK6ZXeHayxS0n64Li">
    <App />
    </AuthProvider>
  </StrictMode>,
)
