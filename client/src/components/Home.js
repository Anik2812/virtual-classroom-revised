import React from 'react';
import { Typography, Container, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -1000 }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <Typography variant="h2" gutterBottom>
                Welcome to Virtual Classroom
              </Typography>
              <Typography variant="h5" paragraph>
                An interactive learning experience for students and teachers.
              </Typography>
              <Button component={Link} to="/login" variant="contained" color="primary" size="large" style={{ marginRight: '1rem' }}>
                Login
              </Button>
              <Button component={Link} to="/register" variant="outlined" color="secondary" size="large">
                Register
              </Button>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 1000 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 120, delay: 0.5 }}
            >
              <Paper elevation={3} style={{ padding: '2rem', borderRadius: '15px' }}>
                <Typography variant="h4" gutterBottom>
                  Features
                </Typography>
                <Typography variant="body1" paragraph>
                  • Interactive live classes
                </Typography>
                <Typography variant="body1" paragraph>
                  • Real-time chat and discussions
                </Typography>
                <Typography variant="body1" paragraph>
                  • Assignment submission and grading
                </Typography>
                <Typography variant="body1" paragraph>
                  • Resource sharing and management
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Home;