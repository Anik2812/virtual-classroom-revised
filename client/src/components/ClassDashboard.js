import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ClassDashboard = () => {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await api.get(`/classes/${classId}`);
        setClassInfo(response.data);
      } catch (err) {
        console.error('Error fetching class info:', err);
        setError('Failed to fetch class information.');
      }
    };
    fetchClassInfo();
  }, [classId]);

  return (
    <Container>
      {error && <Typography color="error">{error}</Typography>}
      {classInfo ? (
        <div>
          <Typography variant="h4">{classInfo.name}</Typography>
          <Typography variant="h6">Teacher: {classInfo.teacher}</Typography>
          <Typography variant="h6">Students:</Typography>
          <List>
            {classInfo.students.map((student) => (
              <ListItem key={student._id}>
                <ListItemText primary={student.username} />
              </ListItem>
            ))}
          </List>
        </div>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};

export default ClassDashboard;
