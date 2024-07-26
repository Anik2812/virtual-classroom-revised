import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, CircularProgress, Card, CardContent, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { Assignment, Event, Announcement, Book } from '@mui/icons-material';

const StudentDashboard = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      const response = await api.get('/classes');
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
              <Box mt={2}>
                <Typography variant="subtitle1">Class Schedule:</Typography>
                <Typography variant="body2">Monday - Friday: 9:00 AM - 3:00 PM</Typography>
                <Typography variant="body2">Saturday: 9:00 AM - 12:00 PM</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <Assignment color="primary" /> Upcoming Assignments
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Math: Algebra Quiz" secondary="Due: Tomorrow" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Science: Lab Report" secondary="Due: Next Week" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="English: Book Review" secondary="Due: In 2 Weeks" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <Event color="secondary" /> Upcoming Events
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Mid-Term Exams" secondary="Starts: Next Month" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Science Fair" secondary="Date: In 3 Weeks" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Parent-Teacher Meeting" secondary="Date: This Saturday" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <Announcement color="error" /> Announcements
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="New Study Material Available" secondary="Check the Resources section" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Upcoming Guest Lecture" secondary="Topic: Career Guidance" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <Book color="primary" /> Recent Grades
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Math Quiz" secondary="Grade: A" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="English Essay" secondary="Grade: B+" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Science Project" secondary="Grade: A-" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default StudentDashboard;