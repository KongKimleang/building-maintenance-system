import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentProfile from './pages/resident/Profile';
import TechnicianDashboard from './pages/technician/Dashboard';
import TechnicianProfile from './pages/technician/Profile';
import SubmitRequest from './pages/resident/SubmitRequest';
import MyRequests from './pages/resident/MyRequests';
import ResidentRequestDetails from './pages/resident/RequestDetails';
import ResidentHistory from './pages/resident/History';
import MyTasks from './pages/technician/MyTasks';
import AllRequests from './pages/admin/AllRequests';
import AdminHistory from './pages/admin/History';
import TaskDetails from './pages/technician/TaskDetails';
import TechnicianHistory from './pages/technician/History';
import AdminRequestDetails from './pages/admin/RequestDetails';
import UserManagement from './pages/admin/UserManagement';
import ChangePassword from './pages/auth/ChangePassword';

function App() {
  return (
    <Router>
      <Toaster position="top-right" containerClassName="mt-4" />
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Authentication route */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Dashboard routes */}
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/requests" element={<AllRequests />} />
        <Route path="/admin/history" element={<AdminHistory />} />
        <Route
          path="/admin/request-details/:id"
          element={<AdminRequestDetails />}
        />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* Resident routes */}
        <Route path="/resident/dashboard" element={<ResidentDashboard />} />
        <Route path="/resident/profile" element={<ResidentProfile />} />
        <Route path="/resident/submit-request" element={<SubmitRequest />} />
        <Route path="/resident/my-requests" element={<MyRequests />} />
        <Route path="/resident/history" element={<ResidentHistory />} />
        <Route
          path="/resident/request-details/:id"
          element={<ResidentRequestDetails />}
        />

        {/* Technician routes */}
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
        <Route path="/technician/profile" element={<TechnicianProfile />} />
        <Route path="/technician/tasks" element={<MyTasks />} />
        <Route path="/technician/history" element={<TechnicianHistory />} />
        <Route path="/technician/task-details/:id" element={<TaskDetails />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
