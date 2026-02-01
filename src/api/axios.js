import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "X-App-Client": "kce-admin",
  },
});

// Response interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error response exists
    if (error.response) {
      const { status, data } = error.response;

      // Check if status is 401 or if the custom statusCode in data is 401
      // matching the specific message pattern provided by the user
      if (
        status === 401 ||
        (data &&
          data.statusCode === 401 &&
          data.message === "Not authorized, please login")
      ) {
        // Prevent infinite loop or bad UX if already on login page
        if (window.location.pathname !== "/login") {
          // Clear authentication data
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect to login page with session expired flag
          window.location.href = "/login?sessionExpired=true";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
