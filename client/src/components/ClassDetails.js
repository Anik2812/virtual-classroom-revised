import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import api from '../api/axios';

const ClassDetails = () => {
  const [classDetails, setClassDetails] = useState(null);
  const { classId } = useParams();

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const response = await api.get(`/classes/${classId}`);
      setClassDetails(response.data);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request aborted. Retrying...');
        fetchClassDetails();
      } else {
        console.error('Error fetching class details:', error);
      }
    }
  };

  if (!classDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h3" gutterBottom>{classDetails.name}</Typography>
      <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h5" gutterBottom>Enrolled Students</Typography>
        <List>
          {classDetails.students.map((student) => (
            <ListItem key={student._id}>
              <ListItemText primary={student.name} secondary={student.email} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper elevation={3} style={{ padding: '1rem' }}>
        <Typography variant="h5" gutterBottom>Assignments</Typography>
        <List>
          {classDetails.assignments.map((assignment) => (
            <ListItem key={assignment._id}>
              <ListItemText 
                primary={assignment.title} 
                secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ClassDetails;
