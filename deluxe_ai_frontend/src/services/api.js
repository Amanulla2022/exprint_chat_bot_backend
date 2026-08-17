import axios from "axios";

const api = axios.create({
  baseURL: "https://nlkvqp7q-5000.inc1.devtunnels.ms/api/chat",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);

    return Promise.reject(
      error.response?.data || {
        success: false,
        message: "Server unavailable",
      },
    );
  },
);

export default api;
