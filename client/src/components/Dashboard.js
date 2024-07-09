import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Button, CircularProgress, Modal, Box, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get('/users/profile');
        setUser(userResponse.data);

        if (userResponse.data.role === 'student') {
          const classResponse = await api.get(`/classes/${userResponse.data.classId}`);
          setClassData(classResponse.data);
        } else {
          const classesResponse = await api.get('/classes');
          setClassData(classesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateClass = async () => {
    try {
      const response = await api.post('/classes', { name: newClassName });
      setClassData([...classData, response.data]);
      setNewClassName('');
      handleClose();
    } catch (error) {
      console.error('Error creating class:', error);
    }
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
          Welcome, {user?.username}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5" gutterBottom>
                {user?.role === 'student' ? 'Your Class' : 'Your Classes'}
              </Typography>
              {user?.role === 'student' ? (
                <Typography>{classData?.name}</Typography>
              ) : (
                classData?.map((cls) => (
                  <Button key={cls._id} variant="outlined" fullWidth style={{ marginBottom: '0.5rem' }}>
                    {cls.name}
                  </Button>
                ))
              )}
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
