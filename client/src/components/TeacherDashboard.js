import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../api/axios';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleCreateClass = async () => {
    try {
      await api.post('/classes', { name: newClassName });
      setNewClassName('');
      setOpenDialog(false);
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await api.delete(`/classes/${classId}`);
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Teacher Dashboard</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Create New Class
      </Button>
      <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>Your Classes:</Typography>
      <List>
        {classes.map((cls) => (
          <ListItem key={cls._id}>
            <ListItemText primary={cls.name} />
            <Button variant="outlined" color="secondary" onClick={() => handleDeleteClass(cls._id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            type="text"
            fullWidth
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateClass} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherDashboard;