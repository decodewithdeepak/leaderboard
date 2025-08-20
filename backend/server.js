const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const User = require('./models/User');
const PointHistory = require('./models/PointHistory');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Server running without database connection. Please start MongoDB.');
    });

// Get all users with their rankings
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ totalPoints: -1 });
        // Update ranks based on totalPoints
        users.forEach((user, index) => {
            user.rank = index + 1;
            user.save();
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new user
app.post('/api/users', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name
        });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Claim points for a user
app.post('/api/users/:userId/claim', async (req, res) => {
    try {
        const points = Math.floor(Math.random() * 10) + 1; // Random points between 1-10
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create point history record
        const history = new PointHistory({
            userId: user._id,
            points: points
        });
        await history.save();

        // Update user's total points
        user.totalPoints += points;
        await user.save();

        // Update all users' rankings
        const users = await User.find().sort({ totalPoints: -1 });
        const updatePromises = users.map((u, index) => {
            u.rank = index + 1;
            return u.save();
        });
        await Promise.all(updatePromises);

        res.json({
            points,
            totalPoints: user.totalPoints,
            rank: user.rank
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get point history for a user
app.get('/api/users/:userId/history', async (req, res) => {
    try {
        const history = await PointHistory.find({ userId: req.params.userId })
            .sort({ timestamp: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
