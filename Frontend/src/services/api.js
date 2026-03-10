// API base URL
const API_URL = 'http://localhost:5000/api';

// Login function
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Register function (Admin creates user)
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Submit maintenance request
export const createRequest = async (requestData) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create request');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get my requests (current user)
export const getMyRequests = async () => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/requests/my-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get requests');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get all requests (admin/technician)
export const getAllRequests = async () => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get requests');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get single request by ID
export const getRequestById = async (id) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get request');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get all users (Admin)
export const getAllUsers = async () => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get users');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete user (Admin)
export const deleteUser = async (userId) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Assign technician to request (Admin)
export const assignTechnician = async (requestId, technicianId) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/requests/${requestId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ technicianId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to assign technician');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get all technicians (Admin)
export const getAllTechnicians = async () => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get users');
    }

    // Filter only technicians
    const technicians = data.users.filter(u => u.role === 'technician');
    return { technicians };
  } catch (error) {
    throw error;
  }
};