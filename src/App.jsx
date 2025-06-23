import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Registrarse from './components/Registrarse';
import ListEvangelismo from './components/ListEvangelismo';
import AgregarEvangelismo from './components/AgregarEvangelismo';
import EditarEvangelismo from './components/editarEvangelismo';
import { useAuthContext } from './contexts/AuthContext';
import { useEffect } from 'react';

function App() {
  const {verificacionLog, admin} = useAuthContext();

  useEffect(() => {
    verificacionLog()
  }, [])
  return (
    <div>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/registrarse" element={<Registrarse/>} />
          <Route path="/listaEvangelismo" element={<ListEvangelismo/>} />
          <Route path="/admin/agregarEvangelismo" element={<AgregarEvangelismo/>} />
          <Route path="/admin/editarEvangelismo" element={<EditarEvangelismo/>} />
        </Routes>
      </Router>
      <Footer/>
    </div>
    
  )
}

export default App
