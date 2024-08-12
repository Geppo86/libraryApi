import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from '@mui/material';

const RemoveBook: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleRemove = async () => {
        try {
            await axios.delete(`/api/Books/${id}`);
            navigate('/');
        } catch (err) {
            console.error('Failed to remove book.');
        }
    };

    return (
        <Container>
            <h2>Are you sure you want to remove this book?</h2>
            <Button variant="contained" color="secondary" onClick={handleRemove}>
                Yes, Remove
            </Button>
        </Container>
    );
};

export default RemoveBook;
