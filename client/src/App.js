import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Assignments from './components/Assignments';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import ClassDetails from './components/ClassDetails';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/class/:classId" element={<ClassDetails />} />
        <Route path="/assignments/:classId" element={<Assignments />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              {localStorage.getItem('userRole') === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
        
      </Routes>
    </Router>
  );
};

export default App;