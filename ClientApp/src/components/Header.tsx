import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    username: string;
    role: string;
    onLogout: () => void; // Add a logout handler prop
}

const Header: React.FC<HeaderProps> = ({ username, role, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Call the logout handler to clear credentials
        navigate('/'); // Redirect to Homepage
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Library Management System
                </Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="body1" style={{ marginRight: '15px' }}>
                        Logged in as: <strong>{username}</strong>
                    </Typography>
                    <Typography variant="body1" style={{ marginRight: '15px' }}>
                        Role: <strong>{role}</strong>
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
