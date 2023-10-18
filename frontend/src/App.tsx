import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomeNoAuth from './pages/HomeNoAuth'
import NotFound from './pages/NotFound'
import { useAuthContext } from './hooks/contextsHooks/useAuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import HomeAuth from './pages/HomeAuth'
import AddMoviePage from './pages/AddMoviePage'

export default function App() {
  const {state}  = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route
            path="/" 
            element={state.user ? <HomeAuth /> : <HomeNoAuth />}
          />
          <Route 
            path="/add" 
            element={state.user ? <AddMoviePage /> : <Navigate to="/" />}
          />
          <Route 
            path="/login" 
            element={!state.user ? <Login /> : <Navigate to="/" />}
          />
          <Route 
            path="/register" 
            element={!state.user ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}