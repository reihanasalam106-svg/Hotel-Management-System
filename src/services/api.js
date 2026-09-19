/**
 * Frontend REST API Service Layer
 * Connects React frontend to Node.js + Express + PostgreSQL backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const TOKEN_KEY = 'hotelpro_token';
export const USER_KEY = 'hotelpro_user';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {}
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {}
}

/**
 * Handles HTTP responses and standard error extraction
 * @param {Response} response
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = (data && data.message) || `HTTP error! status: ${response.status}`;
    
    // Enrich message for common status codes if generic
    if (response.status === 401 && !data?.message) {
      errorMessage = 'Session expired or invalid credentials. Please log in again.';
    } else if (response.status === 403 && !data?.message) {
      errorMessage = 'Access denied. You do not have permission to perform this action.';
    } else if (response.status === 404 && !data?.message) {
      errorMessage = 'Requested resource was not found.';
    } else if (response.status === 409 && !data?.message) {
      errorMessage = 'Conflict detected. The resource or room reservation already exists.';
    } else if (response.status >= 500 && !data?.message) {
      errorMessage = 'A server error occurred. Please try again later.';
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    error.isConflict = response.status === 409;
    error.isUnauthorized = response.status === 401;
    error.isForbidden = response.status === 403;
    throw error;
  }

  return data;
}

/**
 * Builds full URL with optional query parameters
 * @param {string} endpoint
 * @param {Record<string, any>} [params]
 */
function buildUrl(endpoint, params) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const fullUrlString = base.startsWith('http')
    ? `${base}${cleanEndpoint}`
    : `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}${base}${cleanEndpoint}`;
  const url = new URL(fullUrlString);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'All') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Default request headers with automatic JWT Bearer token attachment
 */
function getDefaultHeaders(customHeaders = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const api = {
  /**
   * HTTP GET Request
   */
  async get(endpoint, params = {}, headers = {}) {
    const url = buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(headers)
    });
    return handleResponse(response);
  },

  /**
   * HTTP POST Request
   */
  async post(endpoint, body = {}, headers = {}) {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  /**
   * HTTP PUT Request
   */
  async put(endpoint, body = {}, headers = {}) {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  /**
   * HTTP PATCH Request
   */
  async patch(endpoint, body = {}, headers = {}) {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  /**
   * HTTP DELETE Request
   */
  async delete(endpoint, headers = {}) {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getDefaultHeaders(headers)
    });
    return handleResponse(response);
  }
};

// Module-specific REST API helper methods
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary')
};

export const roomsApi = {
  getAll: (params) => api.get('/rooms', params),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  updateStatus: (id, statusData) => api.patch(`/rooms/${id}/status`, statusData),
  delete: (id) => api.delete(`/rooms/${id}`)
};

export const guestsApi = {
  getAll: (params) => api.get('/guests', params),
  getById: (id) => api.get(`/guests/${id}`),
  create: (data) => api.post('/guests', data),
  update: (id, data) => api.put(`/guests/${id}`, data),
  updateStatus: (id, status) => api.patch(`/guests/${id}/status`, { status }),
  delete: (id) => api.delete(`/guests/${id}`)
};

export const reservationsApi = {
  getAll: (params) => api.get('/reservations', params),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }),
  checkIn: (id) => api.post(`/reservations/${id}/check-in`),
  checkOut: (id) => api.post(`/reservations/${id}/check-out`),
  cancel: (id) => api.post(`/reservations/${id}/cancel`),
  delete: (id) => api.delete(`/reservations/${id}`)
};

export const housekeepingApi = {
  getAll: (params) => api.get('/housekeeping/tasks', params),
  getById: (id) => api.get(`/housekeeping/tasks/${id}`),
  create: (data) => api.post('/housekeeping/tasks', data),
  update: (id, data) => api.put(`/housekeeping/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/housekeeping/tasks/${id}/status`, { status }),
  assignStaff: (id, assignedStaffId) => api.patch(`/housekeeping/tasks/${id}/assign`, { assignedStaffId }),
  delete: (id) => api.delete(`/housekeeping/tasks/${id}`)
};

export const billingApi = {
  getAll: (params) => api.get('/billing', params),
  getById: (id) => api.get(`/billing/${id}`),
  create: (data) => api.post('/billing', data),
  update: (id, data) => api.put(`/billing/${id}`, data),
  addPayment: (id, paymentData) => api.post(`/billing/${id}/payments`, paymentData),
  updateStatus: (id, status) => api.patch(`/billing/${id}/status`, { status }),
  cancel: (id) => api.post(`/billing/${id}/cancel`)
};

export const staffApi = {
  getAll: (params) => api.get('/staff', params),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  updateStatus: (id, status) => api.patch(`/staff/${id}/status`, { status }),
  delete: (id) => api.delete(`/staff/${id}`)
};

export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data)
};

export const reportsApi = {
  getSummary: (params) => api.get('/reports/summary', params)
};

export default api;
