import { useNavigate } from 'react-router-dom';
import useHistory from '../../hooks/useHistory';

const HistoryPage = () => {
  const { matches, error, loading } = useHistory();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white rounded shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Historique des parties</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => {
                
              const isFinished = match.turns.length === 3 || match.winner !== undefined;
              let resultText = '';
              if (isFinished) {
                if (match.winner === null) {
                  resultText = 'Match nul';
                } else if (match.winner) {
                  resultText = `Vainqueur : ${match.winner.username}`;
                } else {
                  resultText = 'Match terminé';
                }
              } else {
                resultText = 'En cours';
              }

              return (
                <div key={match._id} className="p-4 border rounded hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Joueur 1 : {match.user1?.username || 'Inconnu'}</p>
                      <p className="font-medium">Joueur 2 : {match.user2?.username || 'En attente'}</p>
                    </div>
                    <div className="text-sm text-gray-600">{resultText}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">ID : {match._id}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Aucune partie trouvée.</p>
        )}
      </div>
      <button
        onClick={() => navigate('/game')}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
      >
        Retour au jeu
      </button>
    </div>
  );
};

export default HistoryPage;
