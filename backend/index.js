require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config.json');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
// MODELS
const User = require('./models/user.model');
const Note = require('./models/note.model');
const Section = require('./models/section.model');
const Page = require('./models/page.model');
// MOONGO DB CONNECTIONS
mongoose.connect(config.connectionString);
app.use(express.json());
app.use(cors({ origin: '*' }));
app.listen(process.env.PORT || 8000);

// creates a user account
app.post('/create-user', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: true, message: 'Username is required.' });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'Password is required.' });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required.' });
  }
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({ error: true, message: 'User already exists' });
  }
  const user = new User({ name, password, email });
  await user.save();
  const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '12h',
  });
  return res.json({
    error: false,
    message: 'User created successfully.',
    token,
    user,
  });
});
// for Reference API
// login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'Password is required.' });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required.' });
  }
  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.json({ error: true, message: 'User not found' });
  }
  if (email === userInfo.email && password === userInfo.password) {
    const token = jwt.sign(
      { user: userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '12h',
      }
    );
    return res.json({
      error: false,
      message: 'User logged in successfully.',
      token,
      email,
      username: userInfo?.name || 'johnDoe',
    });
  } else {
    return res.json({ error: true, message: 'Incorrect credentials' });
  }
});

// get user
app.get('/get-user', authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
      return res.json({ error: true, message: 'User not found' });
    }
    return res.json({
      error: false,
      message: 'User retrieved successfully.',
      user: {
        username: isUser.name,
        email: isUser.email,
        created_at: isUser.created_at,
        password: isUser.password,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: 'Internal Server Error' });
  }
});
// add Notes
app.post('/add-notes', authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;
  if (!title) {
    return res.status(400).json({ error: true, message: 'Title is required.' });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: 'Content is required.' });
  }
  try {
    const note = new Note({
      title,
      content,
      user: user._id,
      tags: tags || [],
    });
    await note.save();
    return res.json({
      error: false,
      message: 'Note added successfully.',
      note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: 'Internal Server Error' });
  }
});

// edit Note
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const noteId = req.params.noteId;
  const { user } = req.user;

  if (!title && !content) {
    return res
      .status(400)
      .json({ error: true, message: 'Title or content is required.' });
  }
  try {
    const note = await Note.findOne({ _id: noteId, user: user._id });
    console.log('noteid :', noteId);
    if (!note) {
      return res
        .status(400)
        .json({ error: true, message: user._id + '//' + noteId });
    }
    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    await note.save();
    return res.json({
      error: false,
      message: 'Note updated successfully.',
      note,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

// get all notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ user: user._id });
    return res.json({
      error: false,
      notes,
      message: 'All notes retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

// delete note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOneAndDelete({ _id: noteId, user: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: 'Note not found.' });
    }
    return res.json({
      error: false,
      message: 'Note deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

// Notebook project API
// Add section
app.post('/add-section', authenticateToken, async (req, res) => {
  const { title, sectionId } = req.body;
  const { user } = req.user;
  try {
    const section = await Section.findOneAndUpdate(
      { _id: sectionId || new mongoose.Types.ObjectId(), userId: user._id },
      { title: title || '', userId: user._id },
      { upsert: true, new: true }
    );

    await section.save();
    return res.json({
      error: false,
      message: 'Section created successfully.',
      section,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});
// fetch All sections for current user
app.get('/get-sections', authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    // Fetch sections and their corresponding pages
    const sections = await Section.find({ userId: user._id }).lean();
    const sectionIds = sections.map((section) => section._id);

    // Fetch pages for all sections in parallel
    const pages = await Page.find({ sectionId: { $in: sectionIds } }).lean();

    // Map pages to their respective sections
    const sectionsWithPages = sections.map((section) => ({
      ...section,
      pages: pages.filter(
        (page) => page.sectionId.toString() === section._id.toString()
      ),
    }));

    res.json({
      error: false,
      sections: sectionsWithPages,
      message: 'Sections with pages retrieved successfully.',
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});
//delete sections with notes
app.delete(
  '/delete-section/:sectionId',
  authenticateToken,
  async (req, res) => {
    const sectionId = req.params.sectionId;
    const { user } = req.user;

    try {
      // Find the section
      const section = await Section.findOne({
        _id: sectionId,
        userId: user._id,
      });
      console.log(
        'user id:',
        user._id,
        'section id:',
        sectionId,
        'section name:',
        section
      );
      if (!section) {
        return res
          .status(404)
          .json({ error: true, message: 'Section not found.' });
      }

      // Delete all notes associated with the section
      await Note.deleteMany({ sectionId: sectionId });

      // Delete the section
      await Section.deleteOne({ _id: sectionId });

      return res.json({
        error: false,
        message: 'Section and associated notes deleted successfully.',
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
);
// Add Page
app.post('/add-page', authenticateToken, async (req, res) => {
  const { title, content, sectionId, pageId } = req.body;
  const { user } = req.user;

  if (!title || !sectionId) {
    return res
      .status(400)
      .json({ error: true, message: 'Title and Section ID are required.' });
  }

  try {
    const section = await Section.findOne({ _id: sectionId, userId: user._id });
    if (!section) {
      return res
        .status(404)
        .json({ error: true, message: 'Section not found or access denied.' });
    }

    const page = await Page.findOneAndUpdate(
      { _id: pageId || new mongoose.Types.ObjectId() },
      { title, content, sectionId, userId: user._id },
      { upsert: true, new: true }
    );

    return res.json({
      error: false,
      message: 'Page saved successfully.',
      page,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

// get recent top 10 pages for current user
app.get('/recent-pages', authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const recentPages = await Page.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      error: false,
      recentPages,
      message: 'Recent pages retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});
module.exports = app;
