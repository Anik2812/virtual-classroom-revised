import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import api from '../api/axios';

const StudentDashboard = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
      <Typography variant="h6" gutterBottom>Your Classes:</Typography>
      <List>
        {classes.map((cls) => (
          <ListItem key={cls._id}>
            <ListItemText primary={cls.name} secondary={`Teacher: ${cls.teacher.username}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default StudentDashboard;