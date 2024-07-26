import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Avatar, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: 'auto',
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
        setUpdatedUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await api.put('/users/profile', updatedUser);
      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Typography variant="h3" gutterBottom>Profile</Typography>
        <StyledPaper elevation={3}>
          <LargeAvatar src="/static/images/avatar/1.jpg" alt={user?.name} />
          <Grid container spacing={3} style={{ marginTop: '1rem' }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={editMode ? updatedUser.name : user?.name}
                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={editMode ? updatedUser.email : user?.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Board"
                value={editMode ? updatedUser.board : user?.board}
                onChange={(e) => setUpdatedUser({ ...updatedUser, board: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Standard"
                value={editMode ? updatedUser.standard : user?.standard}
                onChange={(e) => setUpdatedUser({ ...updatedUser, standard: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={editMode ? updatedUser.bio : user?.bio}
                onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}
                disabled={!editMode}
              />
            </Grid>
          </Grid>
          {editMode ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              style={{ marginTop: '1rem' }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditMode(true)}
              style={{ marginTop: '1rem' }}
            >
              Edit Profile
            </Button>
          )}
        </StyledPaper>
        
        <Grid container spacing={3} style={{ marginTop: '2rem' }}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>Achievements</Typography>
              {user?.achievements?.map((achievement, index) => (
                <Chip
                  key={index}
                  label={achievement}
                  color="primary"
                  style={{ margin: '0.5rem' }}
                />
              ))}
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>Extra-curricular Activities</Typography>
              {user?.extracurricular?.map((activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  color="secondary"
                  style={{ margin: '0.5rem' }}
                />
              ))}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Profile;