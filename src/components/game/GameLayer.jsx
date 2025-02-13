import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useGame from '../../hooks/useGame';

const GameLayer = () => {
  const { handleLogout } = useAuth();
  const { match, error, loading, token, username, findOrCreateMatch, refreshMatch, isMatchOver, handleMove } = useGame();

  useEffect(() => {
    if (!token || !username) handleLogout();
    findOrCreateMatch();
  }, []);

  useEffect(() => {
    if (!match) return;
    const intervalId = setInterval(() => {
      refreshMatch();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [match]);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-700">Chargement du match...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Erreur : {error}</div>;
  if (!match) return <div className="flex justify-center items-center min-h-screen text-gray-500">Aucun match en cours.</div>;

  const { user1, user2, turns, winner } = match;
  const yourName = username || 'Vous';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Salut {yourName} !</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Se déconnecter</button>
        </div>

        <div className="space-y-4 text-gray-700">
          <p>Joueur 1 : {user1?.username || 'En attente...'}</p>
          <p>Joueur 2 : {user2?.username || 'En attente...'}</p>
        </div>

        {!user2 && (
          <div className="text-center text-gray-500">En attente qu&apos;un autre joueur rejoigne la partie...</div>
        )}

        {isMatchOver() && (
          <div className="text-center font-semibold">
            {winner === null ? (
              <p className="text-yellow-500">La partie est terminée : Match nul !</p>
            ) : winner ? (
              <p className="text-green-500">La partie est terminée, vainqueur : {winner.username}</p>
            ) : (
              <p className="text-red-500">3 manches jouées, pas de vainqueur ?</p>
            )}
          </div>
        )}

        {!isMatchOver() && user1 && user2 && (
          <div className="flex justify-around">
            <button onClick={() => handleMove('rock')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Pierre</button>
            <button onClick={() => handleMove('paper')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Feuille</button>
            <button onClick={() => handleMove('scissors')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Ciseaux</button>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold">Historique des coups</h2>
          {turns && turns.length > 0 ? (
            turns.map((turn, index) => {
              let turnWinner = '';
              if (turn.winner === 'user1') turnWinner = user1?.username;
              if (turn.winner === 'user2') turnWinner = user2?.username;
              if (turn.winner === 'draw') turnWinner = 'Égalité';

              return (
                <div key={index} className="border-t border-gray-200 pt-4">
                  <p>
                    <strong>Manche {index + 1} :</strong>
                    <br />
                    {user1?.username} a joué : {turn.user1 || '-'}
                    <br />
                    {user2?.username} a joué : {turn.user2 || '-'}
                    {turn.winner && (
                      <>
                        <br />
                        <span className="text-blue-600">Gagnant de la manche : {turnWinner}</span>
                      </>
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">Aucun coup n&apos;a encore été joué.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLayer;
