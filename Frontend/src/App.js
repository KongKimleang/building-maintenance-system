import React, { useEffect, useState } from 'react';
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
import { getHealthStatus } from './services/api';

function App() {
  const [health, setHealth] = useState({
    reachable: true,
    database: 'connected',
  });
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);

  const checkHealth = async (showLoading = false) => {
    try {
      if (showLoading) {
        setCheckingHealth(true);
      }

      const data = await getHealthStatus();

      setHealth({
        reachable: true,
        database: data.database || 'connected',
      });
    } catch (error) {
      setHealth({
        reachable: false,
        database: 'unknown',
      });
    } finally {
      setLastCheckedAt(new Date());
      if (showLoading) {
        setCheckingHealth(false);
      }
    }
  };

  useEffect(() => {
    checkHealth(false);
    const interval = setInterval(() => checkHealth(false), 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const showBackendDownBanner = !health.reachable;
  const showDbWarningBanner =
    health.reachable && health.database !== 'connected';
  const lastCheckedLabel = lastCheckedAt
    ? `Last checked: ${lastCheckedAt.toLocaleTimeString()}`
    : 'Last checked: --';

  return (
    <Router>
      {showBackendDownBanner && (
        <div className="bg-red-600 text-white px-4 py-2 text-sm text-center font-medium flex items-center justify-center gap-3">
          <span>
            Backend is unreachable. Please check if the server is running.{' '}
            <span className="text-xs opacity-90">{lastCheckedLabel}</span>
          </span>
          <button
            type="button"
            onClick={() => checkHealth(true)}
            disabled={checkingHealth}
            className="rounded border border-white/60 px-2 py-1 text-xs font-semibold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {checkingHealth ? 'Checking...' : 'Retry now'}
          </button>
        </div>
      )}

      {showDbWarningBanner && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-sm text-center font-medium flex items-center justify-center gap-3">
          <span>
            Database status: {health.database}. API may not work correctly.{' '}
            <span className="text-xs opacity-90">{lastCheckedLabel}</span>
          </span>
          <button
            type="button"
            onClick={() => checkHealth(true)}
            disabled={checkingHealth}
            className="rounded border border-slate-900/40 px-2 py-1 text-xs font-semibold hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {checkingHealth ? 'Checking...' : 'Retry now'}
          </button>
        </div>
      )}

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
