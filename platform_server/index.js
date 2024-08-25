const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
    const user = new User({ username, password: hashedPassword, firstName, lastName });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
