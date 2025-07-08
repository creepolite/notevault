const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');

const router = express.Router();


router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
    if (err) return res.status(400).json({ error: 'User already exists or error occurred.' });
    res.status(201).json({ message: 'User created successfully!', userId: this.lastID });
  });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful', userId: user.id });
  });
});


router.get('/notes/:userId', (req, res) => {
  const { userId } = req.params;

  db.all('SELECT * FROM notes WHERE user_id = ?', [userId], (err, notes) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch notes' });
    res.json(notes);
  });
});


router.post('/notes', (req, res) => {
  const { userId, title, content } = req.body;

  db.run('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to create note' });
    res.status(201).json({ message: 'Note added!', noteId: this.lastID });
  });
});


router.delete('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  db.run('DELETE FROM notes WHERE id = ?', [noteId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete note' });
    res.json({ message: 'Note deleted successfully' });
  });
});

module.exports = router;