const express = require('express');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const router = new express.Router();

// Get all classes (without authentication, for registration)
router.get('/all', async (req, res) => {
  try {
    const classes = await Class.find({}, 'name');
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new class
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can create classes' });
  }
  const newClass = new Class({
    ...req.body,
    teacher: req.user._id,
  });
  try {
    await newClass.save();
    req.user.classes.push(newClass._id);
    await req.user.save();
    res.status(201).send(newClass);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all classes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    let classes;
    if (req.user.role === 'teacher') {
      classes = await Class.find({ teacher: req.user._id });
    } else {
      classes = await Class.find({ students: req.user._id });
    }
    res.send(classes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific class
router.get('/:id', auth, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).send();
    }
    res.send(classItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a class
router.patch('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can update classes' });
  }
  try {
    const classItem = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!classItem) {
      return res.status(404).send();
    }
    res.send(classItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a class
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can delete classes' });
  }
  try {
    const classItem = await Class.findOneAndDelete({ _id: req.params.id, teacher: req.user._id });
    if (!classItem) {
      return res.status(404).send();
    }
    req.user.classes = req.user.classes.filter(classId => classId.toString() !== req.params.id);
    await req.user.save();
    res.send(classItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;