import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Registrarse from './components/Registrarse';
import ListEvangelismo from './components/ListEvangelismo';
import { useAuthContext } from './contexts/AuthContext';
import { useEffect } from 'react';
import CrudEvangelismo from './components/CrudEvangelismo';
import ListUsuarios from './components/ListUsuarios';
import CrudPersonas from "./components/CrudPersonas"; // donde tengas ese componente
import ListaEvangelismoPorFecha from './components/ListaEvangelismoPorFecha';


function App() {
  const {verificacionLog, admin} = useAuthContext();

  useEffect(() => {
    verificacionLog()
  }, [])
  return (
    
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/registrarse" element={<Registrarse/>} />
          <Route path="/listaEvangelismo" element={<ListEvangelismo/>} />
          <Route path="/admin/crud" element={<CrudEvangelismo/>} />
          <Route path='/admin/usuarios' element={<ListUsuarios/>}/>
          <Route path="/personas" element={<CrudPersonas />} />
          <Route path="/personasfechas" element={<ListaEvangelismoPorFecha />} />
          <Route path="/evangelismos" element={<ListaEvangelismoPorFecha />} />
          <Route path="/evangelismo/:evangelismoId/personas" element={<CrudPersonas />} />
        </Routes>
          
          <Footer/>
      </Router>
    
    
  )
}

export default App
