const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

// Login
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

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

// Register new user (Admin only)
export const registerUser = async (userData) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

// Get all users
export const getAllUsers = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
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

// Create maintenance request
export const createRequest = async (requestData) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

// Get current user's requests
export const getMyRequests = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/my-requests`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch requests');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get all requests (Admin/Technician)
export const getAllRequests = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch requests');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get request by ID
export const getRequestById = async (id) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch request');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Assign technician to request
export const assignTechnician = async (requestId, technicianId) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/${requestId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

// Get all technicians
export const getAllTechnicians = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    // Filter only technicians
    const technicians = data.users.filter((user) => user.role === 'technician');

    return { technicians };
  } catch (error) {
    throw error;
  }
};

// Update request status
export const updateRequestStatus = async (requestId, status, notes = '') => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/${requestId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update status');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get technician's tasks
export const getMyTasks = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/my-tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tasks');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get request statistics
export const getRequestStats = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Add comment to request
export const addComment = async (requestId, comment) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/${requestId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add comment');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user's notifications
export const getNotifications = async () => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch notifications');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark notification as read');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark all notifications as read');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
