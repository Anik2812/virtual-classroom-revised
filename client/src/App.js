import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ClassRoom from './components/ClassRoom';
import Assignments from './components/Assignments';
import Profile from './components/Profile';
import { AnimatePresence } from 'framer-motion';
import ClassDashboard from './components/ClassDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // A nice blue shade
    },
    secondary: {
      main: '#f50057', // A vibrant pink for accents
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/classroom/:id" element={<PrivateRoute><ClassRoom /></PrivateRoute>} />
            <Route path="/assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/dashboard/:classId" element={<ClassDashboard />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;