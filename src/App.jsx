import { Routes, Route, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Game from './components/game/Game'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/game" />} />
    </Routes>
  )
}

export default App