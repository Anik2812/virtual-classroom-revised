import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Button, Modal, TextField, Box } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchUserData();
    fetchClasses();
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h3" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5" gutterBottom>
                Your Classes
              </Typography>
              {classes.map((cls) => (
                <Button key={cls._id} variant="outlined" fullWidth style={{ marginBottom: '0.5rem' }}>
                  {cls.name}
                </Button>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5" gutterBottom>
                Upcoming Assignments
              </Typography>
              {/* Add assignment list here */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              {/* Add recent activity list here */}
            </Paper>
          </Grid>
        </Grid>
        {user?.role === 'teacher' && (
          <>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem' }}
              onClick={handleOpen}
            >
              Create New Class
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="create-class-modal-title"
              aria-describedby="create-class-modal-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
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
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default Dashboard;
