// src/components/Assignments.js
import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Button, TextField, List, ListItem,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Delete as DeleteIcon, Edit as EditIcon, Upload as UploadIcon } from '@mui/icons-material';
import api from '../api/axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledInput = styled('input')({
  display: 'none',
});

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' });
  const [userRole, setUserRole] = useState('teacher');
  const [file, setFile] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAssignments();
    fetchUserRole();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request aborted. Retrying...');
        fetchAssignments();
      } else {
        console.error('Error fetching assignments:', error);
      }
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/users/profile');
      setUserRole(response.data.role);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request aborted. Retrying...');
        fetchUserRole();
      } else if (error.response && error.response.status === 404) {
        console.error('User profile not found.');
      } else {
        console.error('Error fetching user role:', error);
      }
    }
  };

  const handleCreateAssignment = async () => {
    try {
      const response = editMode
        ? await api.patch(`/assignments/${selectedAssignment._id}`, newAssignment)
        : await api.post('/assignments', {
            title: newAssignment.title,
            description: newAssignment.description,
            dueDate: newAssignment.dueDate,
          });
      setAssignments(editMode
        ? assignments.map(a => a._id === response.data._id ? response.data : a)
        : [...assignments, response.data]);
      setOpenDialog(false);
      setNewAssignment({ title: '', description: '', dueDate: '' });
      setEditMode(false);
      setSelectedAssignment(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Invalid request data:', error.response.data);
      } else {
        console.error('Error creating/editing assignment:', error);
      }
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Invalid request data:', error);
      } else {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const openEditDialog = (assignment) => {
    setNewAssignment({ title: assignment.title, description: assignment.description, dueDate: assignment.dueDate });
    setSelectedAssignment(assignment);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedAssignment) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/assignments/${selectedAssignment._id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchAssignments();
      setFile(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Invalid request data:', error);
      } else {
        console.error('Error uploading assignment:', error);
      }
    }
  };

  const handleGradeSubmit = async () => {
    if (!selectedAssignment) return;

    try {
      await api.post(`/assignments/${selectedAssignment._id}/grade`, { grade, feedback });
      fetchAssignments();
      setGrade('');
      setFeedback('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Invalid request data:', error);
      } else {
        console.error('Error submitting grade:', error);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Typography variant="h3" gutterBottom>Assignments</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>Assignment List</Typography>
              <List>
                {assignments.map((assignment) => (
                  <ListItem key={assignment._id} button onClick={() => setSelectedAssignment(assignment)}>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                    {userRole === 'teacher' && (
                      <>
                        <IconButton edge="end" aria-label="edit" onClick={() => openEditDialog(assignment)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAssignment(assignment._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>Assignment Details</Typography>
              {selectedAssignment && (
                <>
                  <Typography variant="h6">{selectedAssignment.title}</Typography>
                  <Typography variant="body1">{selectedAssignment.description}</Typography>
                  <Typography variant="body2">Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</Typography>
                  {userRole === 'student' && (
                    <>
                      <StyledInput accept="file/*" id="upload-file" type="file" onChange={handleFileChange} />
                      <label htmlFor="upload-file">
                        <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                          Upload Assignment
                        </Button>
                      </label>
                      <Button variant="contained" onClick={handleUpload} disabled={!file} style={{ marginTop: '1rem' }}>
                        Submit
                      </Button>
                    </>
                  )}
                  {userRole === 'teacher' && (
                    <>
                      <TextField
                        label="Grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                      />
                      <TextField
                        label="Feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                      />
                      <Button variant="contained" onClick={handleGradeSubmit} style={{ marginTop: '1rem' }}>
                        Submit Grade
                      </Button>
                    </>
                  )}
                </>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
        {userRole === 'teacher' && (
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} style={{ marginTop: '2rem' }}>
            Add New Assignment
          </Button>
        )}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editMode ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Due Date"
              type="date"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment} color="primary">
              {editMode ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
};

export default Assignments;
