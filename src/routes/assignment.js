const express = require('express');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, class: className } = req.body;

    if (!title || !description || !dueDate || !className) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      class: className,
      teacher: req.user._id,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).json({ error: 'Invalid request data', details: error.message });
  }
});


// Get all assignments
router.get('/', auth, async (req, res) => {
  console.log('GET /assignments hit');
  try {
    const assignments = await Assignment.find({});
    res.send(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send(error);
  }
});


// Submit an assignment
router.post('/:id/submit', auth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send({ error: 'Only students can submit assignments' });
  }
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).send();
    }
    const submission = new Submission({
      assignment: assignment._id,
      student: req.user._id,
      content: req.body.content,
    });
    await submission.save();
    res.status(201).send(submission);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update an assignment
router.patch('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can update assignments' });
  }
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!assignment) {
      return res.status(404).send();
    }
    res.send(assignment);
  } catch (error) {
    res.status(400).send(error);
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
      return res.status(404).send();
    }
    res.send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Grade a submission
router.post('/:id/grade', auth, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send({ error: 'Only teachers can grade submissions' });
  }
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).send();
    }
    submission.grade = req.body.grade;
    await submission.save();
    res.send(submission);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;