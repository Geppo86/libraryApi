import React from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

interface Review {
  id: number;
  review: string;
  rating: number;
}

const reviews: Review[] = [
  { id: 1, review: 'Great book!', rating: 5 },
  { id: 2, review: 'Interesting read.', rating: 4 },
  { id: 3, review: 'Not my type.', rating: 2 },
];

const ReviewList: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Reviews
        </Typography>
        <List>
          {reviews.map((review) => (
            <ListItem key={review.id}>
              <ListItemText primary={review.review} secondary={`Rating: ${review.rating}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ReviewList;

// Add this line to make it a module
export {};
