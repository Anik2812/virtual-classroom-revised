import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import api from '../api/axios';

const GradeAssignment = ({ open, handleClose, assignmentId, studentId, currentGrade, onGradeUpdate }) => {
  const [grade, setGrade] = useState(currentGrade || '');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/assignments/${assignmentId}/grade`, {
        studentId,
        grade: parseFloat(grade),
        feedback,
      });
      onGradeUpdate(response.data);
      handleClose();
    } catch (error) {
      console.error('Error submitting grade:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Grade Assignment</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Grade"
          type="number"
          fullWidth
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Feedback"
          fullWidth
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit Grade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeAssignment;