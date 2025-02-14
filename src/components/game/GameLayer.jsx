import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useGame from '../../hooks/useGame';

const GameLayer = () => {
    const { handleLogout } = useAuth();
    const {
        match,
        error,
        loading,
        token,
        username,
        stats,
        findOrCreateMatch,
        isMatchOver,
        handleMove,
        refreshMatch
    } = useGame();

    if (!token || !username) handleLogout();

    useEffect(() => {
        findOrCreateMatch();
    }, []);

    useEffect(() => {
        if (!match?._id) return;

        const refreshInterval = setInterval(() => {
            refreshMatch();
        }, 2000);

        return () => clearInterval(refreshInterval);
    }, [match?._id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Erreur : {error}
                </div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-600">Aucun match en cours.</div>
            </div>
        );
    }

    const { user1, user2, turns, winner } = match;
    const yourName = username || 'Vous';

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded shadow-md">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Salut {yourName} !</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Se déconnecter
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
                    <div className="text-center">
                        <div className="font-bold text-xl">{stats.total}</div>
                        <div className="text-sm text-gray-600">Parties</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-xl text-green-600">{stats.wins}</div>
                        <div className="text-sm text-gray-600">Victoires</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-xl text-red-600">{stats.losses}</div>
                        <div className="text-sm text-gray-600">Défaites</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-xl text-yellow-600">{stats.draws}</div>
                        <div className="text-sm text-gray-600">Égalités</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
                        <span className="font-medium">Joueur 1:</span>
                        <span className="text-blue-600">{user1?.username || 'En attente...'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded">
                        <span className="font-medium">Joueur 2:</span>
                        <span className="text-green-600">{user2?.username || 'En attente...'}</span>
                    </div>
                </div>

                {!user2 && (
                    <div className="text-center p-4 bg-yellow-50 rounded">
                        <span className="text-yellow-600">
                            En attente qu&apos;un autre joueur rejoigne la partie...
                        </span>
                    </div>
                )}

                {isMatchOver() && (
                    <div className="text-center p-6 rounded-lg transform transition-all duration-300 ease-in-out">
                        {winner === null ? (
                            <p className="text-yellow-800 font-medium bg-yellow-50 p-4 rounded">Match nul !</p>
                        ) : winner ? (
                            <p className="text-green-800 font-medium bg-green-50 p-4 rounded">
                                Victoire de {winner.username} !
                            </p>
                        ) : (
                            <p className="text-red-800 font-medium bg-red-50 p-4 rounded">
                                3 manches jouées, pas de vainqueur ?
                            </p>
                        )}
                    </div>
                )}

                {/* Boutons de jeu */}
                {!isMatchOver() && user1 && user2 && (
                    <div className="flex justify-around gap-4">
                        {[
                            { move: 'rock', label: 'Pierre', icon: '🪨' },
                            { move: 'paper', label: 'Feuille', icon: '📄' },
                            { move: 'scissors', label: 'Ciseaux', icon: '✂️' }
                        ].map(({ move, label, icon }) => (
                            <button
                                key={move}
                                onClick={() => handleMove(move)}
                                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                         transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95
                                         flex flex-col items-center gap-2"
                            >
                                <span className="text-2xl">{icon}</span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Historique des coups</h2>
                    {turns && turns.length > 0 ? (
                        <div className="space-y-4">
                            {turns.map((turn, index) => {
                                let turnWinner = '';
                                if (turn.winner === 'user1') turnWinner = user1?.username;
                                if (turn.winner === 'user2') turnWinner = user2?.username;
                                if (turn.winner === 'draw') turnWinner = 'Égalité';

                                return (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg bg-gray-50 transition-all duration-300 ease-in-out hover:shadow-md"
                                    >
                                        <h3 className="font-bold text-lg mb-2">
                                            Manche {index + 1}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-600">
                                                    {user1?.username}:
                                                </span>{' '}
                                                <span className="font-medium">
                                                    {turn.user1 || '-'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    {user2?.username}:
                                                </span>{' '}
                                                <span className="font-medium">
                                                    {turn.user2 || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        {turn.winner && (
                                            <div className="mt-2 text-center font-medium text-blue-600">
                                                {turnWinner}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">
                            Aucun coup n&apos;a encore été joué.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameLayer;