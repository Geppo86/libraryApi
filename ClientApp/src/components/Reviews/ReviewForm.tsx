import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';

const ReviewForm: React.FC = () => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Review:', review, 'Rating:', rating);
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Submit a Review
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Review"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <TextField
            label="Rating"
            type="number"
            fullWidth
            margin="normal"
            value={rating || ''}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '16px' }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ReviewForm;

// Add this line to make it a module
export {};
