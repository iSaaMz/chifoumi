import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useHistory = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${API_URL}/matches`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération de l'historique.");
        }
        return res.json();
      })
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, navigate]);

  return { matches, error, loading };
};

export default useHistory;
