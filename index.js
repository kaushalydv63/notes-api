const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Home API
app.get('/', (req, res) => {
  res.send('Notes API is running with Hostinger Database');
});

// GET: Fetch all active notes (Jo trash me nahi hain: is_deleted = 0)
app.get('/api/notes', (req, res) => {
  const query = 'SELECT * FROM notes WHERE is_deleted = 0 ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// GET: Fetch all trash notes (Jo trash me hain: is_deleted = 1)
app.get('/api/trash', (req, res) => {
  const query = 'SELECT * FROM notes WHERE is_deleted = 1 ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Trash Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// POST: Add a new note
app.post('/api/notes', (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const query = 'INSERT INTO notes (title, content, category, is_deleted) VALUES (?, ?, ?, 0)';
  db.query(query, [title, content, category || 'Personal'], (err, result) => {
    if (err) {
      console.error("MySQL Insert Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, title, content, category: category || 'Personal', is_deleted: 0 } 
    });
  });
});

// PUT: Update an existing note by ID
app.put('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, content, category, is_pinned, is_favorite } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const query = 'UPDATE notes SET title = ?, content = ?, category = ?, is_pinned = ?, is_favorite = ? WHERE id = ?';
  db.query(query, [title, content, category || 'Personal', is_pinned || 0, is_favorite || 0, noteId], (err, result) => {
    if (err) {
      console.error("MySQL Update Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Note updated successfully',
      data: { id: noteId, title, content, category: category || 'Personal', is_pinned, is_favorite } 
    });
  });
});

// PUT: Restore a note from trash by ID (is_deleted = 0)
app.put('/api/notes/restore/:id', (req, res) => {
  const noteId = req.params.id;
  const query = 'UPDATE notes SET is_deleted = 0 WHERE id = ?';

  db.query(query, [noteId], (err, result) => {
    if (err) {
      console.error("MySQL Restore Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note restored successfully' });
  });
});

// DELETE (Soft Delete): Move a note to trash by setting is_deleted = 1
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const query = 'UPDATE notes SET is_deleted = 1 WHERE id = ?';
  
  db.query(query, [noteId], (err, result) => {
    if (err) {
      console.error("MySQL Move to Trash Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note moved to trash successfully' });
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
====================================
🚀 Notes API Server Started
====================================
Local     : http://localhost:${PORT}
Network   : http://10.158.19.32:${PORT}
API       : http://10.158.19.32:${PORT}/api/notes
====================================
`);
});
