import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Typography variant="h1">Welcome to Virtual Classroom</Typography>
      <Button component={Link} to="/login" variant="contained" color="primary">
        Login
      </Button>
      <Button component={Link} to="/register" variant="outlined" color="secondary">
        Register
      </Button>
    </Container>
  );
};

export default Home;