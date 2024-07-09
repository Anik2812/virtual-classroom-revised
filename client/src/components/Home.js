import React from 'react';
import { Typography, Container, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';

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
                Experience interactive learning like never before.
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
              <Paper elevation={3} style={{ padding: '2rem', borderRadius: '15px', backgroundColor: '#f0f4f8' }}>
                <Typography variant="h4" gutterBottom>
                  Features
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={2} style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon style={{ marginRight: '1rem', color: '#3f51b5' }} />
                      <Typography variant="body1">
                        Interactive live classes with real-time collaboration
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper elevation={2} style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon style={{ marginRight: '1rem', color: '#f50057' }} />
                      <Typography variant="body1">
                        Easy assignment submission and grading system
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper elevation={2} style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                      <ChatIcon style={{ marginRight: '1rem', color: '#4caf50' }} />
                      <Typography variant="body1">
                        Real-time chat and discussion forums for each class
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Home;