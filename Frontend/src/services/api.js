const API_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

const getToken = () => localStorage.getItem('token');

// Check backend and database health
export const getHealthStatus = async () => {
  const response = await fetch(`${API_URL}/health`, {
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Health check failed');
  }

  return data;
};

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

// Update user (Admin)
export const updateUser = async (userId, userData) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Reset user password (Admin)
export const resetUserPassword = async (userId, newPassword) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/users/${userId}/reset-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
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

    const formData = new FormData();
    formData.append('title', requestData.title);
    formData.append('description', requestData.description);
    formData.append('category', requestData.category);
    formData.append('priority', requestData.priority);
    formData.append('floor', requestData.floor);
    formData.append('unit', requestData.unit);

    if (requestData.photo) {
      formData.append('photo', requestData.photo);
    }

    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

export const getCurrentUser = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Upload current user's profile photo
export const uploadProfilePhoto = async (photoFile) => {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await fetch(`${API_URL}/auth/profile-photo`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload profile photo');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
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

// Update resident request
export const updateRequest = async (requestId, requestData) => {
  try {
    const token = getToken();
    const formData = new FormData();

    formData.append('title', requestData.title);
    formData.append('description', requestData.description);
    formData.append('category', requestData.category);
    formData.append('priority', requestData.priority);
    formData.append('floor', requestData.floor);
    formData.append('unit', requestData.unit);

    if (requestData.removePhoto) {
      formData.append('removePhoto', 'true');
    }

    if (requestData.photo) {
      formData.append('photo', requestData.photo);
    }

    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update request');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete request (Admin)
export const deleteRequest = async (requestId) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete request');
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
        Authorization: `Bearer ${token}`,
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

    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to mark all notifications as read'
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Seed sample notifications for the logged-in user (testing)
export const seedNotifications = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/notifications/seed`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to seed notifications');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
