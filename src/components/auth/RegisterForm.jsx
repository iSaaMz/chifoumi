import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const RegisterForm = () => {
  const { username, setUsername, password, setPassword, confirmPassword, setConfirmPassword, error, setError, handleRegister } = useAuth();

  return (
    <div>
      <h2>Inscription Chi Fou Mi</h2>
      <form onSubmit={handleRegister}>
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
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <Link to="/login">Déjà inscrit ? Se connecter</Link>
        </div>

        <button type="submit">S&apos;inscrire</button>
      </form>
    </div>
  )
}

export default RegisterForm