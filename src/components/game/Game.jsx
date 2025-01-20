// Game.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Game = () => {
  const [match, setMatch] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  useEffect(() => {
    findOrCreateMatch()
  }, [])

  const findOrCreateMatch = async () => {
    try {
      const resGet = await fetch('http://fauques.freeboxos.fr:3000/matches', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resGet.ok) {
        setError('Erreur lors du GET /matches')
        setLoading(false)
        return
      }
      const allMatches = await resGet.json()

      const currentMatch = allMatches.find((m) => {
        const isFinished = m.winner !== undefined || m.turns.length === 3
        return !isFinished
      })

      if (currentMatch) {
        setMatch(currentMatch)
        setLoading(false)
      } else {
        const resPost = await fetch('http://fauques.freeboxos.fr:3000/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!resPost.ok) {
          const errBody = await resPost.json()
          setError(errBody.match || 'Impossible de créer/joindre un match.')
          setLoading(false)
          return
        }
        const newMatch = await resPost.json()
        setMatch(newMatch)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError('Erreur réseau lors de la récupération/du match.')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!match) return

    const intervalId = setInterval(() => {
      refreshMatch()
    }, 3000)
    return () => clearInterval(intervalId)
  }, [match])

  const refreshMatch = async () => {
    if (!match?._id) return
    try {
      const res = await fetch(
        `http://fauques.freeboxos.fr:3000/matches/${match._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) {
        const updatedMatch = await res.json()
        setMatch(updatedMatch)
      }
    } catch (err) {
      console.error('Erreur lors du refresh du match : ', err)
    }
  }

  const getCurrentTurnId = () => {
    if (!match?.turns || match.turns.length === 0) {
      return 1
    }
    const lastIndex = match.turns.length - 1
    const lastTurn = match.turns[lastIndex]

    if (lastTurn.user1 && lastTurn.user2) {
      return match.turns.length + 1
    } else {
      return match.turns.length
    }
  }

  const isMatchOver = () => {
    return match?.winner !== undefined || match?.turns?.length === 3
  }

  const handleMove = async (move) => {
    if (!match || isMatchOver()) return

    const turnId = getCurrentTurnId()
    try {
      const res = await fetch(
        `http://fauques.freeboxos.fr:3000/matches/${match._id}/turns/${turnId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ move }),
        }
      )

      if (!res.ok) {
        const errBody = await res.json()
        setError(errBody.turn || errBody.user || 'Erreur lors de la soumission du coup.')
      } else {
        refreshMatch()
      }
    } catch (err) {
      console.error(err)
      setError('Erreur réseau lors de la soumission du coup.')
    }
  }

  if (loading) {
    return <div>Chargement du match...</div>
  }

  if (error) {
    return <div>Erreur : {error}</div>
  }

  if (!match) {
    return <div>Aucun match en cours.</div>
  }

  const { user1, user2, turns, winner } = match
  const yourName = username || 'Vous'

  return (
    <div>
      <div>
        <h1>Salut {yourName} !</h1>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>

      <div>
        <p>Joueur 1 : {user1?.username || 'En attente...'}</p>
        <p>Joueur 2 : {user2?.username || 'En attente...'}</p>
      </div>

      {!user2 && (
        <div>En attente qu&apos;un autre joueur rejoigne la partie...</div>
      )}

      {isMatchOver() && (
        <div>
          {winner === null ? (
            <p>La partie est terminée : Match nul !</p>
          ) : winner ? (
            <p>La partie est terminée, vainqueur : {winner.username}</p>
          ) : (
            <p>3 manches jouées, pas de vainqueur ?</p>
          )}
        </div>
      )}

      {!isMatchOver() && user1 && user2 && (
        <div>
          <button onClick={() => handleMove('rock')}>Pierre</button>
          <button onClick={() => handleMove('paper')}>Feuille</button>
          <button onClick={() => handleMove('scissors')}>Ciseaux</button>
        </div>
      )}

      <div>
        <h2>Historique des coups</h2>
        {turns && turns.length > 0 ? (
          turns.map((turn, index) => {
            let turnWinner = ''
            if (turn.winner === 'user1') turnWinner = user1?.username
            if (turn.winner === 'user2') turnWinner = user2?.username
            if (turn.winner === 'draw') turnWinner = 'Égalité'

            return (
              <div key={index}>
                <p>
                  <strong>Manche {index + 1} :</strong>
                  <br />
                  {user1?.username} a joué : {turn.user1 || '-'}
                  <br />
                  {user2?.username} a joué : {turn.user2 || '-'}
                  {turn.winner && (
                    <>
                      <br />
                      <span>Gagnant de la manche : {turnWinner}</span>
                    </>
                  )}
                </p>
              </div>
            )
          })
        ) : (
          <p>Aucun coup n&apos;a encore été joué.</p>
        )}
      </div>
    </div>
  )
}

export default Game