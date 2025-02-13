import { useState, useEffect } from 'react';

const useGame = () => {
    const [match, setMatch] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(() => {
        const savedStats = localStorage.getItem('gameStats');
        return savedStats ? JSON.parse(savedStats) : {
            wins: 0,
            losses: 0,
            draws: 0,
            total: 0
        };
    });

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const API_URL = 'http://localhost:3002';

    useEffect(() => {
        localStorage.setItem('gameStats', JSON.stringify(stats));
    }, [stats]);

    const updateStats = (matchResult) => {
        if (!matchResult?.winner && matchResult?.winner !== null) return;
        
        setStats(prev => {
            const newStats = { ...prev };
            newStats.total++;
            
            if (matchResult.winner === null) {
                newStats.draws++;
            } else if (matchResult.winner.username === username) {
                newStats.wins++;
            } else {
                newStats.losses++;
            }
            
            return newStats;
        });
    };

    const setupEventSource = (matchId) => {
        // Utilisation de l'EventSource natif
        const eventSource = new EventSource(
            `${API_URL}/matches/${matchId}/subscribe`,
            // Les headers sont passés via les options de fetch quand nécessaire
        );

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleGameEvent(data);
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    };

    const handleGameEvent = (event) => {
        switch(event.type) {
            case 'PLAYER1_JOIN':
            case 'PLAYER2_JOIN':
            case 'PLAYER1_MOVED':
            case 'PLAYER2_MOVED':
            case 'TURN_ENDED':
            case 'MATCH_ENDED':
            case 'NEW_TURN':
                refreshMatch();
                break;
            default:
                console.log('Unknown event type:', event.type);
        }
    };

    const findOrCreateMatch = async () => {
        try {
            const resGet = await fetch(`${API_URL}/matches`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!resGet.ok) {
                throw new Error('Erreur lors du GET /matches');
            }
            
            const allMatches = await resGet.json();
            
            const currentMatch = allMatches.find((m) => {
                const isFinished = m.winner !== undefined || m.turns.length === 3;
                return !isFinished;
            });
            
            if (currentMatch) {
                setMatch(currentMatch);
                setupEventSource(currentMatch._id);
                setLoading(false);
            } else {
                const resPost = await fetch(`${API_URL}/matches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (!resPost.ok) {
                    const errBody = await resPost.json();
                    throw new Error(errBody.match || 'Impossible de créer/joindre un match.');
                }
                
                const newMatch = await resPost.json();
                setMatch(newMatch);
                setupEventSource(newMatch._id);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    const refreshMatch = async () => {
        if (!match?._id) return;
        
        try {
            const res = await fetch(`${API_URL}/matches/${match._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (res.ok) {
                const updatedMatch = await res.json();
                setMatch(updatedMatch);
                
                if (updatedMatch.winner !== undefined || updatedMatch.turns.length === 3) {
                    updateStats(updatedMatch);
                }
            }
        } catch (err) {
            console.error('Erreur lors du refresh du match : ', err);
        }
    };

    const getCurrentTurnId = () => {
        if (!match?.turns || match.turns.length === 0) {
            return 1;
        }
        const lastIndex = match.turns.length - 1;
        const lastTurn = match.turns[lastIndex];
        
        if (lastTurn.user1 && lastTurn.user2) {
            return match.turns.length + 1;
        } else {
            return match.turns.length;
        }
    };

    const isMatchOver = () => {
        return match?.winner !== undefined || match?.turns?.length === 3;
    };

    const handleMove = async (move) => {
        if (!match || isMatchOver()) return;
        
        const turnId = getCurrentTurnId();
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
            );
            
            if (!res.ok) {
                const errBody = await res.json();
                setError(errBody.turn || errBody.user || 'Erreur lors de la soumission du coup.');
            } else {
                await refreshMatch();
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau lors de la soumission du coup.');
        }
    };

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError('');
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    return {
        match,
        setMatch,
        error,
        setError,
        loading,
        setLoading,
        token,
        username,
        stats,
        findOrCreateMatch,
        refreshMatch,
        getCurrentTurnId,
        isMatchOver,
        handleMove
    };
};

export default useGame;