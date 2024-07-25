const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

// Get all assignments
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new assignment
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, class: classId } = req.body;
    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      class: classId,
    });
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).json({ error: 'Invalid assignment data' });
  }
});

// Update an assignment
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, class: classId } = req.body;
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { title, description, dueDate, class: classId },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(400).json({ error: 'Invalid assignment data' });
  }
});

// Delete an assignment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    if (!deletedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Grade an assignment
router.post('/:id/grade', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { grade, feedback },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error grading assignment:', error);
    res.status(400).json({ error: 'Invalid grade data' });
  }
});

module.exports = router;