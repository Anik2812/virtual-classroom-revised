import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography, Container, Button, CircularProgress, Modal, Box, TextField, Snackbar, List, ListItem, ListItemText,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Card, CardContent, Chip, Avatar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon, CalendarToday, Book } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const Assignments = () => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', class: classId || '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await api.get(classId ? `/assignments/class/${classId}` : '/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      if (error.response && error.response.status === 404) {
        setAssignments([]);
        showSnackbar('No assignments found for this class.');
      } else {
        setAssignments([
          { _id: '1', title: 'Sample Assignment 1', description: 'This is a sample assignment', dueDate: '2023-07-01' },
          { _id: '2', title: 'Sample Assignment 2', description: 'This is another sample assignment', dueDate: '2023-07-15' },
        ]);
        showSnackbar('Failed to fetch assignments. Showing sample data.');
      }
    }
  }, [classId]);

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

  const handleOpen = () => {
    setEditMode(false);
    setSelectedAssignment(null);
    setNewAssignment({ title: '', description: '', dueDate: '', class: classId || '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedAssignment(null);
  };

  const handleCreateOrUpdateAssignment = async () => {
    try {
      let response;
      if (editMode) {
        response = await api.patch(`/assignments/${selectedAssignment._id}`, newAssignment);
        setAssignments(assignments.map(a => a._id === response.data._id ? response.data : a));
      } else {
        response = await api.post('/assignments', newAssignment);
        setAssignments([...assignments, response.data]);
      }
      handleClose();
      showSnackbar(`Assignment ${editMode ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} assignment:`, error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        showSnackbar(`Failed to ${editMode ? 'update' : 'create'} assignment: ${error.response.data.error || 'Unknown error'}`);
      } else {
        showSnackbar(`Failed to ${editMode ? 'update' : 'create'} assignment. Please try again.`);
      }
    }
  };

  const handleEdit = (assignment) => {
    setEditMode(true);
    setSelectedAssignment(assignment);
    setNewAssignment({ ...assignment, class: assignment.class._id });
    setOpen(true);
  };

  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/assignments/${selectedAssignment._id}`);
      setAssignments(assignments.filter(a => a._id !== selectedAssignment._id));
      setDeleteDialogOpen(false);
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
            <Card key={assignment._id} style={{ marginBottom: '1rem' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '1rem' }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Typography variant="h5">{assignment.title}</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {assignment.description}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarToday fontSize="small" style={{ marginRight: '0.5rem' }} />
                  <Typography variant="body2">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Book fontSize="small" style={{ marginRight: '0.5rem' }} />
                  <Typography variant="body2">
                    Class: {assignment.class?.name || 'N/A'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Chip label={assignment.subject || 'General'} color="primary" style={{ marginRight: '0.5rem' }} />
                    <Chip label={`Difficulty: ${assignment.difficulty || 'Medium'}`} color="secondary" />
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEdit(assignment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assignment)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      </motion.div>
      <Dialog open={open} onClose={handleClose}>
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
          {!classId && (
            <TextField
              select
              label="Class"
              fullWidth
              margin="normal"
              value={newAssignment.class}
              onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateOrUpdateAssignment} color="primary">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this assignment?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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