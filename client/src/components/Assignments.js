// src/components/Assignments.js
import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Button, TextField, List, ListItem,
  ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Input
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
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await api.get('/users/profile');
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
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
      setNewAssignment({ title: '', description: '', dueDate: '' });
      setEditMode(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error creating/editing assignment:', error);
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
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
      console.error('Error uploading assignment:', error);
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
      console.error('Error submitting grade:', error);
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
                      <StyledInput
                        accept="application/pdf"
                        id="contained-button-file"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="contained-button-file">
                        <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                          Choose File
                        </Button>
                      </label>
                      {file && <Typography variant="body2">{file.name}</Typography>}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!file}
                        style={{ marginTop: '1rem' }}
                      >
                        Upload
                      </Button>
                    </>
                  )}
                  {userRole === 'teacher' && (
                    <>
                      <TextField
                        label="Grade"
                        type="number"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Feedback"
                        multiline
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGradeSubmit}
                        style={{ marginTop: '1rem' }}
                      >
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
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
            onClick={() => setOpenDialog(true)}
          >
            {editMode ? 'Edit Assignment' : 'Create New Assignment'}
          </Button>
        )}
      </Container>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? 'Edit Assignment' : 'Create New Assignment'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleCreateAssignment} color="primary">{editMode ? 'Save Changes' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Assignments;