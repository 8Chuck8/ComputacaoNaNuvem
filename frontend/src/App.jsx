import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Scores from './pages/Scores'
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Logout from './components/Logout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

    const raw = localStorage.getItem('user');
    // Se não existir, ou for a string "undefined", nem tenta fazer parse
    if (!raw || raw === 'undefined') {
      localStorage.removeItem('user');
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch (err) {
      console.warn('user inválido no localStorage:', raw);
      localStorage.removeItem('user');
    }
  }, []);



  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <Routes>
        <Route path="/" element={<Home />} />

        {
          user ? <>
            {
              user.role === 'admin' &&
              <Route path="/admin" element={<Admin />} />
            }
            <Route path="/scores" element={<Scores user={user} />} />
            <Route path="/logout" element={<Logout setUser={setUser} />} />
          </>
            : <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
            </>
        }
      </Routes>
    </>
  )
}

export default App
