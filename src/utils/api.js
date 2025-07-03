// src/utils/api.js
import axios from "axios";
import { baseUrl } from "./constants";




// Create the Axios instance
const api = axios.create({
  baseURL: baseUrl, // your backend URL
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response?.data?.message && response.config.method !== "get") {
     ;
    }
    return response;
  },
  (error) => {
    const message = error?.response?.data?.message || "Something went wrong";

    return Promise.reject(error);
  }
);

export default api;
