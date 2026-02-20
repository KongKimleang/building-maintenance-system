import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function SubmitRequest() {
  const navigate = useNavigate();
  
  // State to store form data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    floor: '',
    unit: '',
    description: '',
    photo: null
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photo: e.target.files[0]
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.category || !formData.priority || 
        !formData.floor || !formData.unit || !formData.description) {
      alert('Please fill all required fields!');
      return;
    }

    // For now, just show success and redirect (Week 2 will connect to backend)
    console.log('Request submitted:', formData);
    alert('Request submitted successfully! Request ID: #' + Math.floor(Math.random() * 1000));
    navigate('/resident/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        userInfo={{
          name: 'John Doe',
          subtitle: 'Resident - Unit 305',
          dashboardLink: '/resident/dashboard',
          navLinks: [
            { label: 'Dashboard', path: '/resident/dashboard', active: false },
            { label: 'Submit Request', path: '/resident/submit-request', active: true },
            { label: 'My Requests', path: '/resident/my-requests', active: false },
            { label: 'History', path: '/resident/history', active: false }
          ]
        }}
        notificationCount={2}
      />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Maintenance Request</h1>
          <p className="text-gray-600 mt-1">Fill out the form below to report a maintenance issue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          
          {/* Request Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Request Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief description of the issue"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC (AC/Heating)</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Appliance">Appliance</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select priority</option>
                <option value="Low">🟢 Low - Can wait a few days</option>
                <option value="Medium">🟡 Medium - Should be fixed soon</option>
                <option value="High">🔴 High - Urgent, needs immediate attention</option>
              </select>
            </div>
          </div>

          {/* Floor and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Floor */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <select
                id="floor"
                name="floor"
                required
                value={formData.floor}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select floor</option>
                <option value="Ground">Ground Floor</option>
                <option value="1">Floor 1</option>
                <option value="2">Floor 2</option>
                <option value="3">Floor 3</option>
                <option value="4">Floor 4</option>
                <option value="5">Floor 5</option>
              </select>
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit/Room *
              </label>
              <select
                id="unit"
                name="unit"
                required
                value={formData.unit}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select unit</option>
                {formData.floor && formData.floor !== 'Ground' && (
                  <>
                    <option value={`${formData.floor}01`}>Unit {formData.floor}01</option>
                    <option value={`${formData.floor}02`}>Unit {formData.floor}02</option>
                    <option value={`${formData.floor}03`}>Unit {formData.floor}03</option>
                    <option value={`${formData.floor}04`}>Unit {formData.floor}04</option>
                    <option value={`${formData.floor}05`}>Unit {formData.floor}05</option>
                    <option value={`${formData.floor}06`}>Unit {formData.floor}06</option>
                    <option value={`${formData.floor}07`}>Unit {formData.floor}07</option>
                    <option value={`${formData.floor}08`}>Unit {formData.floor}08</option>
                    <option value={`${formData.floor}09`}>Unit {formData.floor}09</option>
                    <option value={`${formData.floor}10`}>Unit {formData.floor}10</option>
                  </>
                )}
                {formData.floor === 'Ground' && (
                  <>
                    <option value="G-001">Reception</option>
                    <option value="G-002">Security Office</option>
                    <option value="G-003">Maintenance Office</option>
                    <option value="G-004">Storage</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe the issue in detail... When did it start? What exactly is happening?"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Attach Photo (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition">
              <div className="space-y-1 text-center">
                <span className="text-4xl">📸</span>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-700"
                  >
                    <span>Upload a file</span>
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                {formData.photo && (
                  <p className="text-sm text-success font-medium">✓ {formData.photo.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/resident/dashboard')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SubmitRequest;