import React, { useState } from 'react';
import { TextField, Button, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
    // State variables to store user inputs for full name, email, password, and role
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer'); // Default role is 'Customer'
    const [error, setError] = useState('');

    // Hook to navigate programmatically to different routes
    const navigate = useNavigate();

    /**
     * Handles the form submission for sign-up.
     * @param e The form event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Send a POST request to the registration endpoint with user inputs
            const response = await axios.post('/api/Auth/register', { fullName, email, password, role });
            if (response.data.message === "Registration successful") {
                // If registration is successful, navigate to the login page
                navigate('/login');
            }
        } catch (err) {
            // If registration fails, display an error message
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <h2>Sign Up</h2>
            {/* Display an error message if registration fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* Input field for full name */}
                <TextField
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                {/* Input field for email */}
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* Input field for password */}
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* Dropdown select for role (Customer or Librarian) */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value as string)}
                    >
                        <MenuItem value="Customer">Customer</MenuItem>
                        <MenuItem value="Librarian">Librarian</MenuItem>
                    </Select>
                </FormControl>
                {/* Submit button for the sign-up form */}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                </Button>
            </form>
        </Container>
    );
};

export default SignUp;
