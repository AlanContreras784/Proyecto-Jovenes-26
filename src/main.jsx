import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UsuariosProvider } from './contexts/UsuarioContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsuariosProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UsuariosProvider>
  </StrictMode>,
)
