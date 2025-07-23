// API Configuration for JustMalikBeats
const API_CONFIG = {
  // Base URL for the API - use proxy in development
  BASE_URL: import.meta.env.PROD ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "",

  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      LOGOUT: "/api/auth/logout",
      PROFILE: "/api/auth/profile",
      REFRESH: "/api/auth/refresh",
    },

    // Users
    USERS: {
      BASE: "/api/users",
      PROFILE: "/api/users/profile",
      UPDATE: "/api/users/profile",
    },

    // Tracks
    TRACKS: {
      BASE: "/api/tracks",
      UPLOAD: "/api/tracks",
      PURCHASE: "/api/tracks/purchase",
    },

    // Blog
    BLOG: {
      BASE: "/api/blog",
      POSTS: "/api/blog/posts",
    },

    // Orders
    ORDERS: {
      BASE: "/api/orders",
      HISTORY: "/api/orders/history",
    },

    // Payments
    PAYMENTS: {
      CREATE_INTENT: "/api/payments/create-payment-intent",
      CONFIRM: "/api/payments/confirm",
    },

    // Admin
    ADMIN: {
      STATS: "/api/admin/stats",
      USERS: "/api/admin/users",
      TRACKS: "/api/admin/tracks",
      BLOG: "/api/admin/blog",
      ORDERS: "/api/admin/orders",
    },

    // Search
    SEARCH: {
      BASE: "/api/search",
      TRACKS: "/api/search/tracks",
      BLOG: "/api/search/blog",
    },

    // Health
    HEALTH: "/api/health",
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  // In development, use relative URLs for proxy
  // In production, use full URL with BASE_URL
  if (import.meta.env.DEV) {
    return endpoint;
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("justmalik_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to make API requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, config);

    // Handle unauthorized responses
    if (response.status === 401) {
      localStorage.removeItem("justmalik_auth_token");
      localStorage.removeItem("justmalik_user_data");
      window.location.href = "/";
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    console.error("Request URL:", url);
    console.error("Request Config:", config);
    throw error;
  }
};

// Helper function to handle file uploads
export const uploadFile = async (endpoint, formData) => {
  const url = buildApiUrl(endpoint);

  const config = {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      // Don't set Content-Type for FormData, let the browser set it
    },
    body: formData,
  };

  try {
    console.log(`Making upload request to: ${url}`);
    console.log("Upload headers:", config.headers);

    const response = await fetch(url, config);

    console.log("Upload response status:", response.status);
    console.log("Upload response ok:", response.ok);

    if (response.status === 401) {
      localStorage.removeItem("justmalik_auth_token");
      localStorage.removeItem("justmalik_user_data");
      window.location.href = "/";
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      console.error("Upload error response:", error);
      throw new Error(error.message || "Upload failed");
    }

    const result = await response.json();
    console.log("Upload success response:", result);
    return result;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

export default API_CONFIG;
export { API_CONFIG };
