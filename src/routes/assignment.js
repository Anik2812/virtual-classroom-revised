const express = require('express');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = new express.Router();

// Create an assignment
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can create assignments' });
  }
  
  try {
    // Validate that the class exists
    const classExists = await Class.findById(req.body.class);
    if (!classExists) {
      return res.status(400).send({ error: 'Invalid class ID' });
    }

    const assignment = new Assignment({
      ...req.body,
      teacher: req.user._id,
    });
    await assignment.save();
    res.status(201).send(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).send({ error: error.message || 'Invalid request data' });
  }
});

// Get all assignments
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({}).populate('class', 'name');
    res.send(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send({ error: 'Error fetching assignments' });
  }
});

// Update an assignment
router.patch('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can update assignments' });
  }
  
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'dueDate', 'class'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }

    updates.forEach((update) => assignment[update] = req.body[update]);
    
    // Validate class ID
    if (req.body.class) {
      const classExists = await Class.findById(req.body.class);
      if (!classExists) {
        return res.status(400).send({ error: 'Invalid class ID' });
      }
    }

    await assignment.save();
    res.send(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(400).send({ error: error.message || 'Error updating assignment' });
  }
});

// Delete an assignment
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can delete assignments' });
  }
  
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }
    res.send(assignment);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).send({ error: 'Error deleting assignment' });
  }
});

// Get assignments for a specific class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId }).populate('class', 'name');
    if (assignments.length === 0) {
      return res.status(404).send({ error: 'No assignments found for this class' });
    }
    res.send(assignments);
  } catch (error) {
    console.error('Error fetching assignments for class:', error);
    res.status(500).send({ error: 'Error fetching assignments for class' });
  }
});

module.exports = router;