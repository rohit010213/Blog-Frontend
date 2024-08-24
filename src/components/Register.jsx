import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../css/Register.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) formData.append('avatar', profileImage);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
            
                navigate('/login');
            } else {
                setError(response.data.message || 'An error occurred.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSignUp}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="profileImage">Profile Image</label>
                <input
                    type="file"
                    id="profileImage"
                    name="avatar" // Ensure this matches the backend field name
                    onChange={(e) => setProfileImage(e.target.files[0])}
                />
                {error && <div className="error">{error}</div>}
                <button type="submit">Register</button>
                <div className="link-container">
                    <button type="button" onClick={() => navigate('/login')}>Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
