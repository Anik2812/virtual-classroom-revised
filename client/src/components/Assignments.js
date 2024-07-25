import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Button, TextField, List, ListItem,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Snackbar, CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../api/axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', class: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments([
        { _id: '1', title: 'Sample Assignment 1', description: 'This is a sample assignment', dueDate: '2023-07-01' },
        { _id: '2', title: 'Sample Assignment 2', description: 'This is another sample assignment', dueDate: '2023-07-15' },
      ]);
      showSnackbar('Failed to fetch assignments. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      const response = editMode
        ? await api.patch(`/assignments/${selectedAssignment._id}`, newAssignment)
        : await api.post('/assignments', newAssignment);
      setAssignments(editMode
        ? assignments.map(a => a._id === response.data._id ? response.data : a)
        : [...assignments, response.data]);
      setOpenDialog(false);
      setNewAssignment({ title: '', description: '', dueDate: '', class: '' });
      setEditMode(false);
      setSelectedAssignment(null);
      showSnackbar(editMode ? 'Assignment updated successfully' : 'Assignment created successfully');
    } catch (error) {
      console.error('Error creating/editing assignment:', error);
      showSnackbar('Failed to create/edit assignment. Please try again.');
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(assignments.filter(a => a._id !== id));
      showSnackbar('Assignment deleted successfully');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      showSnackbar('Failed to delete assignment. Please try again.');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h3" gutterBottom>Assignments</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '1rem' }}
      >
        Create New Assignment
      </Button>
      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid item xs={12} sm={6} md={4} key={assignment._id}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5">{assignment.title}</Typography>
              <Typography variant="body1">{assignment.description}</Typography>
              <Typography variant="body2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</Typography>
              <IconButton onClick={() => {
                setSelectedAssignment(assignment);
                setNewAssignment(assignment);
                setEditMode(true);
                setOpenDialog(true);
              }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteAssignment(assignment._id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? 'Edit Assignment' : 'Create New Assignment'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
          />
          <TextField
            label="Class"
            fullWidth
            margin="normal"
            value={newAssignment.class}
            onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAssignment} color="primary">
            {editMode ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Assignments;