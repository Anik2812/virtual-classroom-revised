import React from 'react';
import { Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import { Link } from 'react-router-dom';

const Home = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  return (
    <Container maxWidth="lg">
      <Particles
        params={{
          particles: {
            number: { value: 80 },
            size: { value: 3 },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: 'repulse' },
            },
          },
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      <animated.div style={fadeIn}>
        <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -1000 }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Virtual Classroom
              </Typography>
              <Typography variant="h5" paragraph>
                An interactive learning experience for students and teachers.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
              >
                Get Started
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
      </animated.div>
    </Container>
  );
};

export default Home;