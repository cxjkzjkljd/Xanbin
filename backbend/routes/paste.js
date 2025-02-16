const express = require('express');
const Paste = require('../models/Paste');
const User = require('../models/User');
const router = express.Router();

// Create a paste
router.post('/', async (req, res) => {
    const { name, content } = req.body;
    try {
        const paste = new Paste({
            name,
            content,
            createdBy: req.userId, // User ID from the authenticated token
        });
        await paste.save();
        res.status(201).json(paste);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all pastes
router.get('/', async (req, res) => {
    try {
        const pastes = await Paste.find().populate('createdBy', 'username');
        res.json(pastes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single paste by ID
router.get('/:id', async (req, res) => {
    try {
        const paste = await Paste.findById(req.params.id).populate('createdBy', 'username');
        if (!paste) {
            return res.status(404).json({ msg: 'Paste not found' });
        }
        paste.views += 1; // Increment view count
        await paste.save();
        res.json(paste);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Comment on a paste
router.post('/:id/comments', async (req, res) => {
    const { text } = req.body;
    try {
        const paste = await Paste.findById(req.params.id);
        if (!paste) {
            return res.status(404).json({ msg: 'Paste not found' });
        }
        const user = await User.findById(req.userId);
        paste.comments.push({
            text,
            createdBy: user._id,
        });
        await paste.save();
        res.status(201).json(paste);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;