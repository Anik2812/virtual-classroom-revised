import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Button, CircularProgress, Modal, Box, TextField, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateClass = async () => {
    try {
      const response = await api.post('/classes', { name: newClassName });
      setClasses([...classes, response.data]);
      setNewClassName('');
      handleClose();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
  try {
    await api.delete(`/classes/${classId}`); // Remove the extra 'api' from the URL
    setClasses(classes.filter((c) => c._id !== classId));
    showSnackbar('Class deleted successfully');
  } catch (error) {
    console.error('Error deleting class:', error);
    showSnackbar('Failed to delete class. Please try again.');
  }
};

  const handleViewClass = (classId) => {
    navigate(`/class/${classId}`);
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
        <Typography variant="h3" gutterBottom>
          Teacher Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          style={{ marginBottom: '1rem' }}
        >
          Create New Class
        </Button>
        <Grid container spacing={3}>
          {classes.map((cls) => (
            <Grid item xs={12} sm={6} md={4} key={cls._id}>
              <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h5">{cls.name}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  style={{ marginTop: '1rem' }}
                  onClick={() => handleViewClass(cls._id)}
                >
                  View Class
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => handleDeleteClass(cls._id)}
                >
                  Delete Class
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </motion.div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-class-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="create-class-modal-title" variant="h6" component="h2">
            Create New Class
          </Typography>
          <TextField
            label="Class Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateClass}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default TeacherDashboard;