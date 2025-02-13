import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const LoginForm = () => {
  const { username, setUsername, password, setPassword, error, setError, handleLogin } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Connexion Chi Fou Mi</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d&apos;utilisateur</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password" 
              name="password"
              type="password"
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="text-sm">
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Pas encore inscrit ?</Link>
          </div>

          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Se connecter</button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm