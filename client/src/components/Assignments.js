import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography, Container, Button, CircularProgress, Modal, Box, TextField, Snackbar, List, ListItem, ListItemText
} from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', class: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchAssignments = useCallback(async () => {
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
    }
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([
        { _id: '1', name: 'Sample Class 1' },
        { _id: '2', name: 'Sample Class 2' },
      ]);
      showSnackbar('Failed to fetch classes. Showing sample data.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAssignments(), fetchClasses()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchAssignments, fetchClasses]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateAssignment = async () => {
    try {
      const response = await api.post('/assignments', newAssignment);
      setAssignments([...assignments, response.data]);
      setNewAssignment({ title: '', description: '', dueDate: '', class: '' });
      handleClose();
      showSnackbar('Assignment created successfully');
    } catch (error) {
      console.error('Error creating assignment:', error);
      showSnackbar('Failed to create assignment. Please try again.');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom>Assignments</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '1rem' }}>
          Create New Assignment
        </Button>
        <List>
          {assignments.map((assignment) => (
            <ListItem key={assignment._id}>
              <ListItemText
                primary={assignment.title}
                secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </motion.div>
      <Modal open={open} onClose={handleClose} aria-labelledby="create-assignment-modal-title">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="create-assignment-modal-title" variant="h6" component="h2">
            Create New Assignment
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
          />
          <TextField
            select
            label="Class"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAssignment.class}
            onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
          >
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </TextField>
          
          <Button variant="contained" color="primary" fullWidth onClick={handleCreateAssignment}>
            Create
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Assignments;