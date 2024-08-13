import React, { useEffect } from 'react';
import { Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = false; // Replace with your actual authentication logic

    /**
     * useEffect hook that runs on component mount and whenever isAuthenticated changes.
     * If the user is authenticated, it automatically navigates them to the books page.
     */
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/books');
        }
    }, [isAuthenticated, navigate]);

    /**
     * Handles the "Login" button click event.
     * Navigates the user to the login page.
     */
    const handleLoginClick = () => {
        navigate('/login');
    };

    /**
     * Handles the "Sign Up" button click event.
     * Navigates the user to the sign-up page.
     */
    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20%' }}>
            <h2>Welcome to the Library App</h2>
            <p>Please choose an option to get started:</p>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginBottom: '10px' }}
                onClick={handleLoginClick}
            >
                Login
            </Button>
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleSignUpClick}
            >
                Sign Up
            </Button>
        </Container>
    );
};

export default HomePage;
