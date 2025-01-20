// Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://fauques.freeboxos.fr:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', username)
        navigate('/game')
      } else {
        setError('Identifiants incorrects')
      }
    } catch (err) {
      console.error(err)
      setError('Erreur de connexion')
    }
  }

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

export default Login