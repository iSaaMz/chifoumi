import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const LoginForm = () => {
  const { username, setUsername, password, setPassword, error, setError, handleLogin } = useAuth();

  return (
    <div>
      <h2>Connexion Chi Fou Mi</h2>
      <form onSubmit={handleLogin}>
        {error && <div>{error}</div>}
        
        <div>
          <label htmlFor="username">Nom d&apos;utilisateur</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password" 
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Link to="/register">Pas encore inscrit ?</Link>
        </div>

        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}

export default LoginForm