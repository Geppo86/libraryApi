import React, { useState, useEffect } from 'react';
import { Container, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditBook: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axios.get(`/api/Books/${id}`);
            const book = response.data;
            setTitle(book.title);
            setAuthor(book.author);
            setDescription(book.description);
        };
        fetchBook();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/Books/${id}`, { title, author, description });
            // Handle success (e.g., navigate to book list)
        } catch (err) {
            setError('Failed to edit book.');
        }
    };

    return (
        <Container>
            <h2>Edit Book</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Author"
                    fullWidth
                    margin="normal"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Save Changes
                </Button>
            </form>
        </Container>
    );
};

export default EditBook;
