import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    building: '',
    unit: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to Terms & Conditions');
      return;
    }

    // For now, just log the values (we'll connect to backend later)
    console.log('Registration attempt:', formData);
    alert('Registration feature will be connected in Week 2!');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d9e8ff_0,_transparent_42%),radial-gradient(circle_at_bottom_right,_#cdeee8_0,_transparent_40%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_left,_#1b3156_0,_transparent_42%),radial-gradient(circle_at_bottom_right,_#173735_0,_transparent_40%)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-6 py-7 text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/85">New Account</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Create Your Account</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85">
              Set up your profile to submit and track building maintenance requests in one place.
            </p>
          </div>

          <form className="space-y-6 p-6 sm:p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-white/95 px-3 py-2.5 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-white/95 px-3 py-2.5 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email Address *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">@</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-white/95 py-2.5 pl-10 pr-3 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Phone Number *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">#</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-white/95 py-2.5 pl-10 pr-3 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Password *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">*</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-300 bg-white/95 py-2.5 pl-10 pr-16 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                    placeholder="Create password"
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

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Confirm Password *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">*</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-gray-300 bg-white/95 py-2.5 pl-10 pr-16 text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Select Role *</label>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70">
                  <input
                    type="radio"
                    name="role"
                    value="resident"
                    checked={formData.role === 'resident'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-200">Resident</span>
                </label>
                <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70">
                  <input
                    type="radio"
                    name="role"
                    value="staff"
                    checked={formData.role === 'staff'}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 dark:text-gray-200">Staff</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="building" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Select Building *
                </label>
                <select
                  id="building"
                  name="building"
                  required
                  value={formData.building}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-white/95 px-3 py-2.5 text-gray-900 outline-none ring-0 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                >
                  <option value="">Choose building</option>
                  <option value="Building A">Building A</option>
                  <option value="Building B">Building B</option>
                  <option value="Building C">Building C</option>
                </select>
              </div>

              <div>
                <label htmlFor="unit" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Select Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-white/95 px-3 py-2.5 text-gray-900 outline-none ring-0 focus:border-primary focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-gray-100"
                >
                  <option value="">Choose unit</option>
                  <option value="101">Unit 101</option>
                  <option value="102">Unit 102</option>
                  <option value="201">Unit 201</option>
                  <option value="202">Unit 202</option>
                </select>
              </div>
            </div>

            <label htmlFor="agreeToTerms" className="inline-flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>
                I agree to the <span className="font-semibold text-primary">Terms & Conditions</span>
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
