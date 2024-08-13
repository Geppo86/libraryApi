import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLogin: (username: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    // State variables to store email, password, and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Hook to navigate programmatically to different routes
    const navigate = useNavigate();

    /**
     * Handles the form submission for login.
     * @param e The form event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Make a POST request to the login API endpoint with email and password
            const response = await axios.post('/api/Auth/login', { email, password });

            if (response.data.message === "Login successful") {
                // If login is successful, invoke the onLogin function to store the username and role
                onLogin(response.data.username, response.data.role);

                // Navigate to the books page after successful login
                navigate('/books');
            }
        } catch (err) {
            // If there is an error, display a generic error message to the user
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxWidth="sm">
            <h2>Login</h2>
            {/* Display an error message if login fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* Email input field */}
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* Password input field */}
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* Submit button for the login form */}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;
