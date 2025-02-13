import { useState } from 'react';

const useGame = () => {
    const [match, setMatch] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // const API_URL = 'http://fauques.freeboxos.fr:3000';
    const API_URL = 'http://localhost:3002';

    const findOrCreateMatch = async () => {
        try {
          const resGet = await fetch(`${API_URL}/matches`, {
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
            const resPost = await fetch(`${API_URL}/matches`, {
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

    const refreshMatch = async () => {
        if (!match?._id) return
        try {
          const res = await fetch(
            `${API_URL}/matches/${match._id}`,
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
            `${API_URL}/matches/${match._id}/turns/${turnId}`,
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

    return { 
        match,
        setMatch, 
        error, 
        setError,
        loading, 
        setLoading,
        token,
        username,
        findOrCreateMatch,
        refreshMatch,
        getCurrentTurnId,
        isMatchOver, 
        handleMove
    };
}

export default useGame;