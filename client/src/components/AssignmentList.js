import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const AssignmentList = ({ classId }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`/api/assignments/class/${classId}`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, [classId]);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Assignments
      </Typography>
      <List>
        {assignments.map((assignment) => (
          <motion.div key={assignment._id} whileHover={{ scale: 1.03 }}>
            <ListItem button>
              <ListItemText 
                primary={assignment.title} 
                secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`} 
              />
              <Button variant="outlined" color="primary">
                View
              </Button>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Container>
  );
};

export default AssignmentList;