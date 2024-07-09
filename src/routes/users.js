const express = require('express');
const User = require('../models/User');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const router = new express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, classId, className } = req.body;
    const user = new User({ username, email, password, role });

    if (role === 'teacher' && className) {
      const newClass = new Class({ name: className, teacher: user._id });
      await newClass.save();
      user.classes = [newClass._id];
    } else if (role === 'student' && classId) {
      user.classes = [classId];
      await Class.findByIdAndUpdate(classId, { $push: { students: user._id } });
    }

    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Unable to login' });
  }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;