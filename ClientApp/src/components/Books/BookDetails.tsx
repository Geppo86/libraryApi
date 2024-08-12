import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Rating, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface BookDetailsProps {
    userRole: string | null;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
}

const BookDetails: React.FC<BookDetailsProps> = ({ userRole }) => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [openReview, setOpenReview] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editedBook, setEditedBook] = useState<any>({});
    const [review, setReview] = useState({ comment: '', rating: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axios.get(`/api/Books/${id}`);
            setBook(response.data);
            setEditedBook(response.data); // Initialize editedBook with the current book details
        };
        fetchBook();
    }, [id]);

    const handleRemove = async () => {
        try {
            await axios.delete(`/api/Books/${id}`);
            navigate('/books');  // Redirect to book list after deletion
        } catch (err) {
            console.error('Failed to delete the book.', err);
        }
    };

    const handleReturn = async () => {
        try {
            await axios.post(`/api/Books/${id}/return`);
            setBook({ ...book, isCheckedOut: false, CheckedOutByUserId: null }); // Update book status locally
        } catch (err) {
            console.error('Failed to return the book.', err);
        }
    };

    const handleCheckout = async () => {
        try {
            const currentDate = new Date().toISOString(); // Current date and time in ISO format
            await axios.post(`/api/Books/${id}/checkout`);
            setBook({ ...book, isCheckedOut: true, checkedOutDate: currentDate }); // Update both properties
        } catch (err) {
            console.error('Failed to checkout the book.', err);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedBook((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditSubmit = async () => {
        try {
            const updateData = {
                ...editedBook,
                isCheckedOut: book.isCheckedOut, // Preserve the existing checkout status
                checkedOutByUserId: book.checkedOutByUserId, // Preserve the existing user who checked out the book
                checkedOutDate: book.checkedOutDate, // Preserve the existing checkout date
            };

            await axios.put(`/api/Books/${id}`, updateData);
            setBook(updateData); // Update the book state with the new details
            setOpenEdit(false);  // Close the modal after submitting
        } catch (err) {
            console.error('Failed to edit the book.', err);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            await axios.post(`/api/Books/${id}/review`, review);
            const updatedReviews = await axios.get(`/api/Books/${id}/reviews`);
            setReviews(updatedReviews.data);  // Refresh the reviews list
            setOpenReview(false);
        } catch (err) {
            console.error('Failed to submit the review.', err);
        }
    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReview(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRatingChange = (_: any, newValue: number | null) => {
        setReview(prevState => ({
            ...prevState,
            rating: newValue || 0,
        }));
    };

    const handleOpenEditModal = () => {
        setOpenEdit(true);
    };

    const handleCloseEditModal = () => {
        setOpenEdit(false);
    };

    const handleOpenReviewModal = async () => {
        try {
            const response = await axios.get(`/api/Books/${id}/reviews`);
            setReviews(response.data);
            setOpenReview(true);
        } catch (err) {
            console.error('Failed to fetch reviews.', err);
        }
    };

    const handleCloseReviewModal = () => {
        setOpenReview(false);
    };

    const getAvailability = () => {
        if (book.isCheckedOut && book.checkedOutDate) {
            const checkedOutDate = new Date(book.checkedOutDate);
            const daysCheckedOut = Math.floor((Date.now() - checkedOutDate.getTime()) / (1000 * 3600 * 24));
            const daysRemaining = Math.max(0, 5 - daysCheckedOut);
            return daysRemaining > 0 ? `Not Available (Due in ${daysRemaining} days)` : "Overdue";
        }
        return 'Available';
    };

    if (!book) return <div>Loading...</div>;

    return (
        <Container>
            <Typography variant="h4">{book.title}</Typography>
            <Typography variant="subtitle1">Author: {book.author}</Typography>
            <Typography variant="body1">{book.description}</Typography>
            <Typography variant="body2">Publisher: {book.publisher}</Typography>
            <Typography variant="body2">Publication Date: {new Date(book.publicationDate).toDateString()}</Typography>
            <Typography variant="body2">Category: {book.category}</Typography>
            <Typography variant="body2">ISBN: {book.isbn}</Typography>
            <Typography variant="body2">Page Count: {book.pageCount}</Typography>
            <Typography variant="body2">Average Rating: {book.averageRating || 'No ratings yet'}</Typography>
            <Typography variant="body2">Availability: {getAvailability()}</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckout} disabled={book.isCheckedOut}>Checkout</Button>
            <Button variant="contained" color="primary" onClick={handleOpenReviewModal}>Leave a Review</Button>

            {userRole === 'Librarian' && (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
                        onClick={handleRemove}
                    >
                        Remove Book
                    </Button>
                    <Button
                        variant="contained"
                        style={{ marginLeft: '10px' }}
                        onClick={handleOpenEditModal}
                    >
                        Edit Book
                    </Button>
                    {book.isCheckedOut && (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '10px' }}
                            onClick={handleReturn}
                        >
                            Return Book
                        </Button>
                    )}
                </>
            )}

            {/* Edit Book Modal */}
            <Dialog open={openEdit} onClose={handleCloseEditModal}>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        margin="normal"
                        value={editedBook.title || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="Author"
                        name="author"
                        fullWidth
                        margin="normal"
                        value={editedBook.author || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        margin="normal"
                        value={editedBook.description || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="Cover Image"
                        name="coverImage"
                        fullWidth
                        margin="normal"
                        value={editedBook.coverImage || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="Publisher"
                        name="publisher"
                        fullWidth
                        margin="normal"
                        value={editedBook.publisher || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="Publication Date"
                        name="publicationDate"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={editedBook.publicationDate ? new Date(editedBook.publicationDate).toISOString().split('T')[0] : ''}
                        onChange={handleEditChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Category"
                        name="category"
                        fullWidth
                        margin="normal"
                        value={editedBook.category || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="ISBN"
                        name="isbn"
                        fullWidth
                        margin="normal"
                        value={editedBook.isbn || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        label="Page Count"
                        name="pageCount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={editedBook.pageCount || ''}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal} color="secondary">Cancel</Button>
                    <Button onClick={handleEditSubmit} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Leave Review Modal */}
            <Dialog open={openReview} onClose={handleCloseReviewModal}>
                <DialogTitle>Leave a Review</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Comment"
                        name="comment"
                        fullWidth
                        margin="normal"
                        value={review.comment}
                        onChange={handleReviewChange}
                        inputProps={{ maxLength: 256 }}
                    />
                    <FormControl margin="normal" fullWidth>
                        <InputLabel>Rating</InputLabel>
                        <Rating
                            name="rating"
                            value={review.rating}
                            onChange={handleRatingChange}
                        />
                    </FormControl>
                    <Typography variant="h6" style={{ marginTop: '20px' }}>Latest Reviews:</Typography>
                    {reviews.map((rev, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <Rating value={rev.rating} readOnly />
                            <Typography variant="body2">{rev.comment}</Typography>
                            <Typography variant="caption">{new Date(rev.createdAt).toDateString()}</Typography>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewModal} color="secondary">Cancel</Button>
                    <Button onClick={handleReviewSubmit} color="primary">Submit Review</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookDetails;
