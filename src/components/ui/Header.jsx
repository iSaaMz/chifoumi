import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { handleLogout } = useAuth();
  const username = localStorage.getItem('username');

  return (
    <header className="bg-white shadow-md">
      <div className="w-full max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
        <nav className="flex items-center space-x-6">
          <Link to="/home" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Chi Fou Mi
          </Link>
          <Link to="/history" className="text-lg text-gray-700 hover:text-indigo-600 transition-colors">
            Historique
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-lg">
            Bonjour, <span className="font-semibold">{username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
