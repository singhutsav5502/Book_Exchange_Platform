import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addBook, deleteBook, getBooksByUsername } from '../api/bookApi';
import { toast } from 'react-toastify';

const ListBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);
  const { token, username } = useSelector((state) => state.auth);

  // Fetch books when component mounts or username/token changes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookData = await getBooksByUsername(username, token);
        setBooks(bookData);
      } catch (error) {
        toast.error(`Error fetching books: ${error.message}`);
      }
    };

    fetchBooks();
  }, [username, token]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addBook(title, author, genre.split(','), username, token);
      toast.success('Book added successfully!');
      setTitle('');
      setAuthor('');
      setGenre('');
      // Refetch books after adding
      const updatedBooks = await getBooksByUsername(username, token);
      setBooks(updatedBooks);
    } catch (error) {
      toast.error(`Error adding book: ${error.message}`);
    }
  };
  const handleRemoveBook = async (bookId) => {
    try {
      await deleteBook(bookId, token);
      toast.success('Book removed successfully!');
      // Refetch books after removal
      const updatedBooks = await getBooksByUsername(username, token);
      setBooks(updatedBooks);
    } catch (error) {
      toast.error(`Error removing book: ${error.message}`);
    }
  };
  return (
    <Container component="main" maxWidth="md">
      <Typography component="h1" variant="h5">
        Manage Your Books
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="author"
          label="Author"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          id="genre"
          label="Genre (comma-separated)"
          name="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Book
        </Button>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography component="h2" variant="h6">
          Your Books
        </Typography>
        <List>
          {books.map((book) => (
            <ListItem key={book._id} sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              edge="start" 
              color="error" 
              aria-label="remove" 
              onClick={() => handleRemoveBook(book._id)}
            >
              <DeleteIcon />
            </IconButton>
            <ListItemText
              primary={`${book.title} by ${book.author}`}
              secondary={`Genre: ${book.genre.join(', ')}`}
              sx={{ ml: 2 }}
            />
          </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ListBooks;
