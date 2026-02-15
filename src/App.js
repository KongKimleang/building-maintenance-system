import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ResidentDashboard from './pages/resident/Dashboard';
import TechnicianDashboard from './pages/technician/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Authentication route */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/resident/dashboard" element={<ResidentDashboard />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
        

      </Routes>
    </Router>
  );
}

export default App;