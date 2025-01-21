import { Routes, Route, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import GamePage from './views/GamePage'

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/game" />} />
    </Routes>
  )
}

export default App