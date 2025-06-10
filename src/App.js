import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CadastroPage from './pages/CadastroPage';
import Login from './components/Login'
import Home from "./components/Home";


function App() {
  return (
    <Router>
      <nav>
        <Link to="/"></Link>
         <Link to="/login"></Link>
      </nav>

      <Routes>
        <Route path="/" element={<CadastroPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/home" element={<Home />} />
      </Routes>

    </Router>
  );
}

export default App;
