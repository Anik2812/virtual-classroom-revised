import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { username, email, password, role };
      if (role === 'student') {
        userData.classId = classId;
      }
      await api.post('/users/register', userData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Join Virtual Classroom
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </FormControl>
          {role === 'student' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Class</InputLabel>
              <Select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
              >
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
            Register
          </Button>
        </form>
      </motion.div>
    </Container>
  );
};

export default Register;