import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClassList = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Classes
      </Typography>
      <List>
        {classes.map((classItem) => (
          <motion.div key={classItem._id} whileHover={{ scale: 1.03 }}>
            <ListItem button>
              <ListItemText primary={classItem.name} secondary={classItem.description} />
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

export default ClassList;