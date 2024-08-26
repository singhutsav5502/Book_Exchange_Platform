import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
// API functions
import { getFilteredBooks, getUnexchangedUserBooks } from "../api/bookApi";
import { createBookExchange } from "../api/bookExchange";

const DiscoverBooks = () => {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [bookToGive, setBookToGive] = useState("");
  const { token, username } = useSelector((state) => state.auth);

  // Debounced search and filter function
  const debouncedFetchFilteredBooks = useCallback(
    debounce(async (genre, author, title) => {
      try {
        const fetchedBooks = await getFilteredBooks(
          genre,
          author,
          title,
          token
        );
        setBooks(fetchedBooks);
      } catch (error) {
        toast.error("Error fetching filtered books:", error.message);
      }
    }, 500),
    [token]
  );

  const handleSearch = useCallback(() => {
    debouncedFetchFilteredBooks(genreFilter, authorFilter, titleFilter);
  }, [debouncedFetchFilteredBooks, genreFilter, authorFilter, titleFilter]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleExchangeClick = async (book) => {
    setSelectedBook(book);
    try {
      const books = await getUnexchangedUserBooks(username, token);
      setUserBooks(books.filter((b) => b._id !== book._id)); // Exclude the book that is being exchanged
    } catch (error) {
      toast.error("Error fetching user books:", error.message);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBookToGive("");
  };

  const handleExchange = async () => {
    try {
      await createBookExchange(
        selectedBook._id,
        bookToGive,
        username,
        selectedBook.username,
        token
      );
      toast.success("Book exchange request created successfully!");
      handleCloseDialog();
      handleSearch(); // Refresh the book list
    } catch (error) {
      toast.error("Error creating book exchange:", error.message);
    }
  };

  return (
    <div>
      <TextField
        label="Search Title"
        variant="outlined"
        fullWidth
        onChange={(e) => setTitleFilter(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <TextField
        label="Search Author"
        variant="outlined"
        fullWidth
        onChange={(e) => setAuthorFilter(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <TextField
        label="Search Genre"
        variant="outlined"
        fullWidth
        onChange={(e) => setGenreFilter(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginBottom: "16px" }}
      >
        Search
      </Button>
      <Grid container spacing={2}>
        {books.map((book) => {
          if (book.username !== username) {
            return (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography variant="subtitle1">{book.author}</Typography>
                    <Typography variant="body2">
                      {book.genre.join(", ")}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleExchangeClick(book)}
                    >
                      Exchange
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          } else return null;
        })}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Exchange Book</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Select a book to give:</Typography>
          <FormControl fullWidth style={{ marginTop: "16px" }}>
            <InputLabel>Book to Give</InputLabel>
            <Select
              value={bookToGive}
              onChange={(e) => setBookToGive(e.target.value)}
            >
              {userBooks.map((book) => (
                <MenuItem key={book._id} value={book._id}>
                  {book.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleExchange} color="primary">
            Exchange
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DiscoverBooks;
