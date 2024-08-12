import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, TextField, MenuItem, Select, InputLabel, FormControl, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../Header'; // Import the Header component*/

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    publisher: string;
    publicationDate: string;
    category: string;
    isbn: string;
    pageCount: number;
}

const BookList: React.FC<{ userRole: string | null }> = ({ userRole }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<'title' | 'author' | 'pageCount'>('title');
    const [open, setOpen] = useState(false);  // State to control the popup
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        publisher: '',
        publicationDate: '',
        category: '',
        isbn: '',
        pageCount: 0,
    });

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await axios.get<Book[]>('/api/Books');
            setBooks(response.data);
            setFilteredBooks(response.data);
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        let updatedBooks = [...books];
        if (searchTerm) {
            updatedBooks = updatedBooks.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortOption) {
            updatedBooks.sort((a, b) => {
                if (typeof a[sortOption] === 'string' && typeof b[sortOption] === 'string') {
                    return (a[sortOption] as string).localeCompare(b[sortOption] as string);
                } else if (typeof a[sortOption] === 'number' && typeof b[sortOption] === 'number') {
                    return (a[sortOption] as number) - (b[sortOption] as number);
                }
                return 0;
            });
        }
        setFilteredBooks(updatedBooks);
    }, [searchTerm, sortOption, books]);

    const handleAddBookClick = () => {
        setOpen(true);  // Open the popup
    };

    const handleClose = () => {
        setOpen(false);  // Close the popup
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBook(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/Books', newBook);
            const addedBook: Book = response.data; // Get the full book object, including the id
            setBooks([...books, addedBook]);
            setOpen(false);
        } catch (err) {
            console.error("Failed to add book.", err);
        }
    };

    return (
        <Container>
            <h2>Book List</h2>
            {userRole === 'Librarian' && (
                <Button variant="contained" color="primary" onClick={handleAddBookClick}>
                    Add Book
                </Button>
            )}
            <TextField
                label="Search"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as 'title' | 'author' | 'pageCount')}
                >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="pageCount">Page Count</MenuItem>
                </Select>
            </FormControl>
            <List>
                {filteredBooks.map((book) => (
                    <ListItem button component={Link} to={`/books/${book.id}`} key={book.id}>
                        <ListItemText
                            primary={book.title}
                            secondary={`Author: ${book.author} | Description: ${book.description}`}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Dialog (popup) for adding a new book */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        margin="normal"
                        value={newBook.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Author"
                        name="author"
                        fullWidth
                        margin="normal"
                        value={newBook.author}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        margin="normal"
                        value={newBook.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Cover Image URL"
                        name="coverImage"
                        fullWidth
                        margin="normal"
                        value={newBook.coverImage}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Publisher"
                        name="publisher"
                        fullWidth
                        margin="normal"
                        value={newBook.publisher}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Publication Date"
                        name="publicationDate"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={newBook.publicationDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Category"
                        name="category"
                        fullWidth
                        margin="normal"
                        value={newBook.category}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="ISBN"
                        name="isbn"
                        fullWidth
                        margin="normal"
                        value={newBook.isbn}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Page Count"
                        name="pageCount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={newBook.pageCount}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookList;
