const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string (replace with your own MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/xanbin';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

const Paste = mongoose.model('Paste', new mongoose.Schema({
  title: String,
  content: String,
  username: String,
  views: { type: Number, default: 0 },
  comments: [{ username: String, comment: String }],
}));

// Routes

// Sign-up route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send({ message: 'User created successfully' });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
  res.send({ token });
});

// Create paste route
app.post('/paste', async (req, res) => {
  const { title, content, username } = req.body;

  const paste = new Paste({ title, content, username });
  await paste.save();
  res.status(201).send({ message: 'Paste created successfully' });
});

// Get all pastes route
app.get('/pastes', async (req, res) => {
  const pastes = await Paste.find();
  res.send(pastes);
});

// View a single paste (with increasing view count)
app.get('/paste/:id', async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) {
    return res.status(404).send({ message: 'Paste not found' });
  }

  paste.views += 1;
  await paste.save();

  res.send(paste);
});

// Comment on a paste route
app.post('/paste/:id/comment', async (req, res) => {
  const { comment, username } = req.body;
  const paste = await Paste.findById(req.params.id);

  if (!paste) {
    return res.status(404).send({ message: 'Paste not found' });
  }

  paste.comments.push({ comment, username });
  await paste.save();

  res.status(201).send({ message: 'Comment added' });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});