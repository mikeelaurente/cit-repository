const API_URL = 'http://localhost:8000/api';

const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const { access_token } = JSON.parse(auth);
    return access_token;
  }
  return null;
};

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export const apiClient = {
  // Auth endpoints
  login: async (identifier, password, type) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ identifier, password, type }),
    });
    return response.json();
  },

  studentSignup: async (data) => {
    const response = await fetch(`${API_URL}/student/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyEmail: async (email, code) => {
    const response = await fetch(`${API_URL}/student/verify`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, code }),
    });
    return response.json();
  },

  resendVerificationCode: async (email) => {
    const response = await fetch(`${API_URL}/student/resend-code`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/student/forgot-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await fetch(`${API_URL}/student/reset-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
    return response.json();
  },

  // Student Capstone endpoints
  getStudentCapstones: async () => {
    const response = await fetch(`${API_URL}/student/capstones`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  getCapstone: async (id) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return response.json();
  },

  getCapstoneDetails: async (id) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  getCapstoneFile: async (id) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  uploadStudentCapstone: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/student/upload-capstone`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    return response.json();
  },

  getCapstoneForVerification: async (id) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  submitCapstone: async (id, data) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getCapstoneSubmissionStatus: async () => {
    const response = await fetch(`${API_URL}/student/capstones`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  updateCapstone: async (id, data) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteStudentCapstone: async (id) => {
    const response = await fetch(`${API_URL}/student/capstones/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  getStudentDashboard: async () => {
    const response = await fetch(`${API_URL}/student/dashboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  // Student Capstone Management
  getCapstoneCitations: async (id) => {
    const response = await fetch(`${API_URL}/capstones/${id}/citations`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return response.json();
  },

  // Search and Browse
  getAllCapstones: async () => {
    const response = await fetch(`${API_URL}/capstones`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return response.json();
  },

  searchCapstones: async (query) => {
    const response = await fetch(
      `${API_URL}/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: getHeaders(false),
      }
    );
    return response.json();
  },

  getPublicCapstoneDetails: async (id) => {
    const response = await fetch(`${API_URL}/capstones/${id}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return response.json();
  },

  // Admin Capstone Management
  getAdminCapstones: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all')
      queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await fetch(
      `${API_URL}/admin/capstones?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return response.json();
  },

  publishCapstone: async (id, data) => {
    const response = await fetch(`${API_URL}/admin/capstones/${id}/publish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        keywords: data.keywords || [],
        category: data.category,
        note: data.note || '',
      }),
    });
    return response.json();
  },

  revertCapstontoPending: async (id, note) => {
    const response = await fetch(
      `${API_URL}/admin/capstones/${id}/revert-to-pending`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ note: note || '' }),
      }
    );
    return response.json();
  },

  rejectCapstone: async (id, note) => {
    const response = await fetch(`${API_URL}/admin/capstones/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ note: note || '' }),
    });
    return response.json();
  },

  createAdminCapstone: async (data) => {
    const response = await fetch(`${API_URL}/admin/capstones/manual`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  editCapstone: async (id, data) => {
    const response = await fetch(`${API_URL}/admin/capstones/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteCapstone: async (id) => {
    const response = await fetch(`${API_URL}/admin/capstones/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  uploadAdminCapstone: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/admin/capstones/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
    return response.json();
  },

  createCapstoneManual: async (data) => {
    const response = await fetch(`${API_URL}/admin/capstones/manual`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Admin User Management
  getAdminUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    const url = `${API_URL}/admin/users${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  createUser: async (data) => {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateUser: async (id, data) => {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  // Current User
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/users/current`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  // Dashboard Statistics
  getDashboardStatistics: async () => {
    const response = await fetch(`${API_URL}/statistics/dashboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },
};
