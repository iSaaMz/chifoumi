import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useGame from '../../hooks/useGame'

const GameLayer = () => {
  const { handleLogout } = useAuth();
  const { match, error, loading, token, username, findOrCreateMatch, refreshMatch, isMatchOver, handleMove } = useGame();

  if(!token || !username) handleLogout();
  
  useEffect(() => {
    findOrCreateMatch()
  }, [])

  useEffect(() => {
    if (!match) return

    const intervalId = setInterval(() => {
      refreshMatch()
    }, 3000)
    return () => clearInterval(intervalId)
  }, [match])

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

export default GameLayer