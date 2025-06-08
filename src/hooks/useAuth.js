import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    // Initialize form fields with empty strings to keep inputs controlled
    // from the first render. Using `null` here would make the inputs switch
    // from uncontrolled to controlled, which triggers React warnings.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Veuillez renseigner tous les champs');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                navigate('/home');
            } else {
                setError('Identifiants incorrects');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur de connexion');
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if(!username || !password || !confirmPassword) {
            setError('Veuillez renseigner tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                navigate('/login');
            } else if (response.status === 409) {
                setError('Ce nom d\'utilisateur est incorrect');
            } else {
                setError('Erreur lors de l\'inscription');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur de connexion au serveur');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        setError,
        handleLogin,
        handleRegister,
        handleLogout,
    };
}

export default useAuth;