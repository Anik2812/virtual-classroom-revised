import React from 'react';
import { Typography, Container, Button, Grid, Paper, Card, CardContent, Avatar } from '@mui/material';
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
                Experience interactive learning tailored for Indian students.
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
            <img src="/images/online-education.jpg" alt="Online Education" style={{ width: '100%', borderRadius: '15px' }} />
          </Grid>
        </Grid>

        <Grid container spacing={4} style={{ marginTop: '2rem' }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Features
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
              <SchoolIcon style={{ fontSize: 40, color: '#3f51b5' }} />
              <Typography variant="h6">Live Classes</Typography>
              <Typography variant="body1">
                Interactive live classes with experienced teachers following CBSE, ICSE, and State Board curricula.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
              <AssignmentIcon style={{ fontSize: 40, color: '#f50057' }} />
              <Typography variant="h6">Smart Assignments</Typography>
              <Typography variant="body1">
                Personalized assignments and mock tests to prepare for board exams and competitive entrance exams.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
              <ChatIcon style={{ fontSize: 40, color: '#4caf50' }} />
              <Typography variant="h6">Doubt Clearing</Typography>
              <Typography variant="body1">
                Real-time doubt clearing sessions and discussion forums for each subject and topic.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4} style={{ marginTop: '2rem' }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Testimonials
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar src="/images/student1.jpg" style={{ width: 60, height: 60, margin: 'auto' }} />
                <Typography variant="h6" align="center">Priya Sharma</Typography>
                <Typography variant="body2" color="textSecondary" align="center">Class 10, CBSE</Typography>
                <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                  "This platform helped me score 95% in my board exams. The teachers are excellent!"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar src="/images/teacher1.jpg" style={{ width: 60, height: 60, margin: 'auto' }} />
                <Typography variant="h6" align="center">Rajesh Gupta</Typography>
                <Typography variant="body2" color="textSecondary" align="center">Physics Teacher</Typography>
                <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                  "As a teacher, I find this platform very intuitive. It helps me connect with students effectively."
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Avatar src="/images/student2.jpg" style={{ width: 60, height: 60, margin: 'auto' }} />
                <Typography variant="h6" align="center">Arjun Patel</Typography>
                <Typography variant="body2" color="textSecondary" align="center">Class 12, State Board</Typography>
                <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                  "The mock tests and personalized feedback have boosted my confidence for upcoming exams."
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Home;