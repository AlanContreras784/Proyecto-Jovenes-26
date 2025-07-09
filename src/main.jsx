import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UsuariosProvider } from './contexts/UsuarioContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { EvangelismoProvider } from './contexts/EvangelismoContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EvangelismoProvider>
    <UsuariosProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UsuariosProvider>
    </EvangelismoProvider>
    
  </StrictMode>,
)
