// Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const RegisterForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    try {
      const response = await fetch('http://fauques.freeboxos.fr:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        navigate('/login')
      } else if (response.status === 409) {
        setError('Ce nom d\'utilisateur existe déjà')
      } else {
        setError('Erreur lors de l\'inscription')
      }
    } catch (err) {
      console.error(err)
      setError('Erreur de connexion au serveur')
    }
  }

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