const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book')
const BookExchange = require('./models/Exchange')
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(express.json());

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    // Validate input
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Email/Username, password, first name, and last name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = new User({ username, passwordHash: hashedPassword, firstName, lastName });
    await user.save();

    const creation_time = new Date().toISOString();
    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, creation_time });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const creation_time = new Date().toISOString();
    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, creation_time });
});
app.get('/user/:username', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }, '-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/book/:bookId', authenticateToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId).populate('username');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/books/find/:username', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const books = await Book.find({ username: user.username });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Fetch user's books not in any exchange
app.get('/books/available/:username', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all books by the user
        const userBooks = await Book.find({ username: user.username });

        // Get all exchanged book IDs
        const exchanges = await BookExchange.find({
            $or: [
                { fromUsername: user.username },
                { toUsername: user.username }
            ]
        });

        const exchangedBookIds = new Set();
        exchanges.forEach(exchange => {
            exchangedBookIds.add(exchange.bookIdAskedFor.toString());
            exchangedBookIds.add(exchange.bookIdSent.toString());
        });

        // Filter out books already exchanged
        const availableBooks = userBooks.filter(book => !exchangedBookIds.has(book._id.toString()));

        res.json(availableBooks);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
});

app.post('/books/add', authenticateToken, async (req, res) => {
    try {
        const { title, author, genre, username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!title || !author) {
            return res.status(400).json({ message: 'Missing Title or Author name' });
        }
        const newBook = new Book({ title, author, genre, username });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/books/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; // Get the book ID from URL parameters
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await Book.findByIdAndDelete(id);
        await BookExchange.deleteMany({
            $or: [
                { bookIdAskedFor: id },
                { bookIdSent: id }
            ]
        });
        res.status(200).json({ message: 'Book removed successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/books', authenticateToken, async (req, res) => {
    try {
        const { username } = req.user;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all books except those added by the current user
        const books = await Book.find({ username: { $ne: user.username } });

        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.get('/books/filter', authenticateToken, async (req, res) => {
    try {
        const { genre, author, title } = req.query;
        const filter = {};

        if (genre) filter.genre = new RegExp(genre, 'i'); // Case-insensitive search
        if (author) filter.author = new RegExp(author, 'i'); // Case-insensitive search
        if (title) filter.title = new RegExp(title, 'i');   // Case-insensitive search

        // Fetch books based on filters
        const books = await Book.find(filter);

        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



app.post('/book-exchange', authenticateToken, async (req, res) => {
    try {
        const { bookIdAskedFor, bookIdSent, fromUsername, toUsername } = req.body;

        // Find the user IDs based on the provided usernames
        const fromUser = await User.findOne({ username: fromUsername });
        const toUser = await User.findOne({ username: toUsername });
        if (!fromUser || !toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new BookExchange document with the found user IDs
        const newExchange = new BookExchange({
            bookIdAskedFor,
            bookIdSent,
            fromUsername: fromUser.username,
            toUsername: toUser.username
        });

        await newExchange.save();
        res.status(201).json(newExchange);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.get('/book-exchange/received/:username', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const exchanges = await BookExchange.find({ toUsername: user.username })
            .populate({
                path: 'bookIdAskedFor',
                select: 'title author genre'
            })
            .populate({
                path: 'bookIdSent',
                select: 'title author genre'
            });

        res.json(exchanges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/book-exchange/sent/:username', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const exchanges = await BookExchange.find({ fromUsername: user.username })
            .populate({
                path: 'bookIdAskedFor',
                select: 'title author genre'
            })
            .populate({
                path: 'bookIdSent',
                select: 'title author genre'
            });

        res.json(exchanges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/book-exchange/accept/:exchangeId', authenticateToken, async (req, res) => {
    try {
        const exchangeId = req.params.exchangeId;

        // Find the exchange document
        const exchange = await BookExchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ message: 'Book exchange not found' });
        }

        // Find the books involved in the exchange
        const bookAskedFor = await Book.findById(exchange.bookIdAskedFor);
        const bookSent = await Book.findById(exchange.bookIdSent);
        const toUser = await User.findOne({ username: bookAskedFor.username });
        const fromUser = await User.findOne({ username: bookSent.username });

        if (!bookAskedFor || !bookSent) {
            return res.status(404).json({ message: 'One or both books not found' });
        }

        // Swap the ownership of the books
        bookAskedFor.username = fromUser.username
        bookSent.username = toUser.username

        await bookAskedFor.save();
        await bookSent.save();

        await BookExchange.findByIdAndDelete(exchangeId);
        await BookExchange.deleteMany({
            $or: [
                { bookIdAskedFor: bookAskedFor._id },
                { bookIdSent: bookAskedFor._id },
                { bookIdAskedFor: bookSent._id },
                { bookIdSent: bookSent._id }
            ]
        });

        res.status(200).json({ message: 'Book exchange accepted and books swapped' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/book-exchange/refuse/:exchangeId', authenticateToken, async (req, res) => {
    try {
        const exchangeId = req.params.exchangeId;

        // Find the exchange document
        const exchange = await BookExchange.findById(exchangeId);
        if (!exchange) {
            return res.status(404).json({ message: 'Book exchange not found' });
        }
        await BookExchange.findByIdAndDelete(exchangeId);

        res.status(200).json({ message: 'Book exchange refused and removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
