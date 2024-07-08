import React from 'react';
import { Typography, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const ClassList = () => {
  // Sample class data
  const classes = [
    { id: 1, title: 'Math', time: '9:00 AM' },
    { id: 2, title: 'Science', time: '11:00 AM' },
    { id: 3, title: 'History', time: '2:00 PM' },
  ];

  return (
    <Grid container spacing={3} style={{ marginTop: '2rem' }}>
      {classes.map((classItem) => (
        <Grid item xs={12} sm={6} md={4} key={classItem.id}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Paper elevation={3} style={{ padding: '1.5rem' }}>
              <Typography variant="h5" gutterBottom>
                {classItem.title}
              </Typography>
              <Typography variant="body1">{classItem.time}</Typography>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom style={{ marginTop: '2rem' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Paper elevation={3} style={{ padding: '1.5rem' }}>
              <Typography variant="h5" gutterBottom>
                Upcoming Classes
              </Typography>
              <Typography variant="body1">
                You have 3 classes scheduled for today.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Paper elevation={3} style={{ padding: '1.5rem' }}>
              <Typography variant="h5" gutterBottom>
                Assignments
              </Typography>
              <Typography variant="body1">
                You have 2 pending assignments.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Paper elevation={3} style={{ padding: '1.5rem' }}>
              <Typography variant="h5" gutterBottom>
                Messages
              </Typography>
              <Typography variant="body1">
                You have 5 unread messages.
              </Typography>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      <ClassList />
      {/* AssignmentList component will be used within individual class views */}
    </Container>
  );
};

export default Dashboard;
