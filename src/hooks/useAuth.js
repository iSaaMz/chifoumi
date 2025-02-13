import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3002";

const useAuth = () => {
    const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError("Veuillez renseigner tous les champs");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: formData.username, password: formData.password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", formData.username);
                navigate("/game");
            } else {
                setError("Identifiants incorrects");
            }
        } catch (err) {
            setError(`Erreur de connexion au serveur : ${err.message}`);
        }
    };

    return { formData, handleChange, handleLogin, error };
};

export default useAuth;
