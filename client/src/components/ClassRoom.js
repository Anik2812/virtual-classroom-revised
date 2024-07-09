import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Typography, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const VideoContainer = styled('div')({
  width: '100%',
  paddingTop: '56.25%', // 16:9 Aspect Ratio
  position: 'relative',
});

const Video = styled('iframe')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

const ClassRoom = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await api.get(`/classes/${id}`);
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    fetchClassData();
    // In a real application, you would set up a WebSocket connection here for real-time messaging
  }, [id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'You' }]);
      setNewMessage('');
      // In a real application, you would send this message to the server via WebSocket
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Typography variant="h3" gutterBottom>{classData?.name}</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>Live Class</Typography>
              <VideoContainer>
                <Video
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoContainer>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>Class Chat</Typography>
              <List style={{ flexGrow: 1, overflow: 'auto', maxHeight: '300px' }}>
                {messages.map((message, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={message.sender} secondary={message.text} />
                  </ListItem>
                ))}
              </List>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                style={{ marginTop: '1rem' }}
              >
                Send
              </Button>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default ClassRoom;