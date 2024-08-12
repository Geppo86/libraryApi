import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

interface HeaderProps {
    username: string;
    role: string;
}

const Header: React.FC<HeaderProps> = ({ username, role }) => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Library Management System
                </Typography>
                <Typography variant="body1" style={{ marginRight: '15px' }}>
                    Logged in as: <strong>{username}</strong>
                </Typography>
                <Typography variant="body1">
                    Role: <strong>{role}</strong>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
