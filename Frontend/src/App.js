import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ResidentDashboard from './pages/resident/Dashboard';
import TechnicianDashboard from './pages/technician/Dashboard';
import SubmitRequest from './pages/resident/SubmitRequest';
import MyRequests from './pages/resident/MyRequests';
import ResidentRequestDetails from './pages/resident/RequestDetails';
import MyTasks from './pages/technician/MyTasks';
import AllRequests from './pages/admin/AllRequests';
import TaskDetails from './pages/technician/TaskDetails';
import AdminRequestDetails from './pages/admin/RequestDetails';
import UserManagement from './pages/admin/UserManagement';
import ChangePassword from './pages/auth/ChangePassword'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Authentication route */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Dashboard routes */}
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AllRequests />} />
        <Route path="/admin/request-details/:id" element={<AdminRequestDetails />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* Resident routes */}
        <Route path="/resident/dashboard" element={<ResidentDashboard />} />
        <Route path="/resident/submit-request" element={<SubmitRequest />} />
        <Route path="/resident/my-requests" element={<MyRequests />} />
        <Route path="/resident/request-details/:id" element={<ResidentRequestDetails />} />
        
        {/* Technician routes */}
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
        <Route path="/technician/tasks" element={<MyTasks />} />
        <Route path="/technician/task-details/:id" element={<TaskDetails />} />
      
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;