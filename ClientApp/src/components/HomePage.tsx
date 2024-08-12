import React, { useEffect } from 'react';
import { Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = false; // Replace with your actual authentication logic

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/books');
        }
    }, [isAuthenticated, navigate]);

    const handleLoginClick = () => {
        navigate('/login');
    };

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
