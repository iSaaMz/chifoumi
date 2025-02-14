import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded shadow-lg p-8">
        <h1 className="text-4xl font-bold text-indigo-600 text-center mb-6">
          Bienvenue sur Chi Fou Mi
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Plongez dans l&apos;univers du Chi Fou Mi, un jeu en ligne captivant qui réunit stratégie, rapidité et amusement. Relevez le défi et mesurez-vous à d&apos;autres joueurs dans des parties intenses et palpitantes !
        </p>
        <div className="flex justify-center mb-8">
          <img
            src="/chifoumi.png"
            alt="Illustration Chi Fou Mi"
            className="rounded-md shadow-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Comment jouer ?</h2>
            <p className="text-gray-700">
              Le jeu se déroule en trois manches. Sélectionnez Pierre, Feuille ou Ciseaux pour battre votre adversaire et remporter la partie.
            </p>
          </div>
          <div className="p-4 border rounded hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Fonctionnalités</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Authentification sécurisée par JWT</li>
              <li>Matchmaking en ligne rapide</li>
              <li>Notifications en temps réel (SSE)</li>
              <li>Statistiques détaillées</li>
            </ul>
          </div>
          <div className="p-4 border rounded hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">Commencez l&apos;aventure</h2>
            <p className="text-gray-700">
              Lancez une partie, défiez vos amis ou améliorez vos statistiques. Chaque victoire vous rapproche du sommet !
            </p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/game')}
            className="px-10 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors"
          >
            Jouer Maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
