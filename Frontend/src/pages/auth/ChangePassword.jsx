import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/api';

function ChangePassword() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError('All fields are required');
      return;
    }

    // Password strength validation
    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(formData.newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(formData.newPassword)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    // Check for at least one number
    if (!/[0-9]/.test(formData.newPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);

      await changePassword(formData.currentPassword, formData.newPassword);

      // Update user in localStorage
      const updatedUser = { ...user, requirePasswordChange: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccessMessage('Password changed successfully. Redirecting to your dashboard...');

      // Redirect to appropriate dashboard after showing in-page success state
      window.setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'resident' || user.role === 'staff') {
          navigate('/resident/dashboard');
        } else if (user.role === 'technician') {
          navigate('/technician/dashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d9e8ff_0,_transparent_42%),radial-gradient(circle_at_bottom_right,_#cdeee8_0,_transparent_40%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_left,_#1b3156_0,_transparent_42%),radial-gradient(circle_at_bottom_right,_#173735_0,_transparent_40%)]">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="grid md:grid-cols-5">
          <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-700 p-7 text-white md:col-span-2 md:p-10">
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_25%_25%,#fff,transparent_40%),radial-gradient(circle_at_80%_70%,#9ee8ff,transparent_35%)]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">Security Update</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight">Change Password Required</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                For account protection, update your temporary password before entering the system.
              </p>

              <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur">
                <p className="text-white/80">Logged in as</p>
                <p className="mt-1 font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:col-span-3 md:p-10">
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5">
              <div>
                <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Current Password (Temporary)
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-2.5 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="Enter your temporary password"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-2.5 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="Create a new password"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 8 characters with uppercase, lowercase, and a number.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-2.5 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="Re-enter your new password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>

              <div className="pt-2 text-center">
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Logout and return to login page
                </button>
              </div>
            </form>
          </section>
        </div>{successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {successMessage}
                </div>
              )}

              
      </div>
    </div>
  );
}

export default ChangePassword;
