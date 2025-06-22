import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navegacion from './components/Nav';

function App() {

  return (
    <div>
      <Header/>
      <Footer/>
    </div>
    
  )
}

export default App
