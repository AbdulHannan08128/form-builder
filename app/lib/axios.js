// lib/axios.js
import axios from 'axios';

// Create an Axios instance with custom configuration
const api = axios.create({
  baseURL: process.env.BASE_URL, // Replace with your API base URL
  timeout: 10000, // Optional: set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  },
});

// Optionally, you can add request and response interceptors here
api.interceptors.request.use(
  (config) => {
    // Modify request config if needed, such as adding authentication tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Handle responses here
    return response;
  },
  (error) => {
    // Handle errors here
    return Promise.reject(error);
  }
);

export default api;
