import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import Navbar from './components/Navbar'
import { Route, Routes, Navigate } from 'react-router-dom'
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

  return (
    <>
      <Navbar user={user} setUser={setUser}/>

      <Toaster 
      position="top-right"
      reverseOrder={false}
      />

      <Routes>
        <Route 
          path="/" 
          element={user ? <Home user={user} /> : <Navigate replace to="/login" />} 
        />
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate replace to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register setUser={setUser} /> : <Navigate replace to="/" />}
        />
        <Route
          path="/logout"
          element={user ? <Logout setUser={setUser} /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/scores"
          element={user ? <Scores user={user} /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <Admin /> : <Navigate replace to="/" />}
        />
      </Routes>

    </>
  )
}

export default App
