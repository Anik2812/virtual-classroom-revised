// src/components/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StudentDashboard = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      const response = await api.get('/api/classes');
      setClassData(response.data[0]); // Assuming student is in only one class
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class data:', error);
      setLoading(false);
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
          Student Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5">Your Class: {classData?.name}</Typography>
              <Typography variant="body1">Teacher: {classData?.teacher?.username}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5">Upcoming Assignments</Typography>
              {/* Add assignment list here */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h5">Recent Grades</Typography>
              {/* Add grades list here */}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default StudentDashboard;