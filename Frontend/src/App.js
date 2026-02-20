import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ResidentDashboard from './pages/resident/Dashboard';
import TechnicianDashboard from './pages/technician/Dashboard';
import SubmitRequest from './pages/resident/SubmitRequest';
import MyRequests from './pages/resident/MyRequests';
import RequestDetails from './pages/resident/RequestDetails';
import MyTasks from './pages/technician/MyTasks';
import AllRequests from './pages/admin/AllRequests';
import TaskDetails from './pages/technician/TaskDetails';
import AdminRequestDetails from './pages/admin/RequestDetails';
import UserManagement from './pages/admin/UserManagement';

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
        <Route path="/resident/submit-request" element={<SubmitRequest />} />
        <Route path="/resident/my-requests" element={<MyRequests />} />
        <Route path="/resident/request-details/:id" element={<RequestDetails />} />
        <Route path="/technician/tasks" element={<MyTasks />} />
        <Route path="/admin/requests" element={<AllRequests />} />
        <Route path="/technician/task-details/:id" element={<TaskDetails />} />
        <Route path="/admin/request-details/:id" element={<AdminRequestDetails />} />
        <Route path="/admin/users" element={<UserManagement />} />
        

      </Routes>
    </Router>
  );
}

export default App;