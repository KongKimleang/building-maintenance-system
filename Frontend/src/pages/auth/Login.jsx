import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

function Login() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call backend API
      const data = await login(email, password);

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Check if password change is required
      if (data.user.requirePasswordChange) {
        navigate('/change-password');
        return;
      }
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'resident' || data.user.role === 'staff') {
        navigate('/resident/dashboard');
      } else if (data.user.role === 'technician') {
        navigate('/technician/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#d9e8ff_0,_transparent_42%),radial-gradient(circle_at_bottom_right,_#cdeee8_0,_transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,_#1b3156_0,_transparent_42%),radial-gradient(circle_at_bottom_right,_#173735_0,_transparent_40%)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.42))] dark:bg-[linear-gradient(135deg,rgba(7,15,32,0.9),rgba(7,15,32,0.72))]" />

      <button
        onClick={toggleTheme}
        className="absolute right-5 top-5 z-20 rounded-full border border-white/50 bg-white/75 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur hover:bg-white dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200"
      >
        {isDark ? 'Switch to Light' : 'Switch to Dark'}
      </button>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur md:grid-cols-5 dark:border-slate-700/60 dark:bg-slate-900/80">
          <section className="relative flex flex-col justify-between gap-8 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-7 text-white md:col-span-2 md:p-10">
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,#fff,transparent_40%),radial-gradient(circle_at_80%_70%,#9ee8ff,transparent_35%)]" />
            <div className="relative">
              <div className="mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/20 backdrop-blur">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                  <rect x="4" y="3" width="16" height="18" rx="2" fill="#ffffff" />
                  <rect x="7" y="6" width="2" height="2" fill="#1d4ed8" />
                  <rect x="11" y="6" width="2" height="2" fill="#1d4ed8" />
                  <rect x="15" y="6" width="2" height="2" fill="#1d4ed8" />
                  <rect x="7" y="10" width="2" height="2" fill="#1d4ed8" />
                  <rect x="11" y="10" width="2" height="2" fill="#1d4ed8" />
                  <rect x="15" y="10" width="2" height="2" fill="#1d4ed8" />
                  <rect x="10" y="15" width="4" height="6" fill="#1d4ed8" />
                </svg>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Building Maintenance System
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
                Manage maintenance requests, monitor progress, and keep every unit running with confidence.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur">
              <p className="font-semibold">Smart routing by role</p>
              <p className="mt-1 text-white/80">
                Login directs Admin, Technician, Resident, and Staff to their dedicated workspace.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:col-span-3 md:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Secure Access</p>
                <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100">Sign in to continue</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Use your work email and password to access your dashboard.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      @
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 bg-white/95 py-2.5 pl-10 pr-3 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      *
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 bg-white/95 py-2.5 pl-10 pr-16 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="remember-me" className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Remember me
                  </label>

                  <span className="text-sm font-semibold text-primary">Need help? Contact admin</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
