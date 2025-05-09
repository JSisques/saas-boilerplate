import axios from 'axios';

/**
 * Custom Axios instance configured for API requests
 * @module api
 */

/**
 * Creates an Axios instance with default configuration
 * @constant {import('axios').AxiosInstance} api
 * @property {string} baseURL - Base URL for API requests from env or localhost
 * @property {Object} headers - Default request headers
 * @property {string} headers.Content-Type - JSON content type header
 * @property {number} timeout - Request timeout in milliseconds
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor to handle authentication
 * @function
 * @param {import('axios').AxiosRequestConfig} config - Request configuration
 * @returns {import('axios').AxiosRequestConfig} Modified request config
 * @throws {Promise<Error>} Throws error if request setup fails
 */
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor to handle API errors
 * @function
 * @param {import('axios').AxiosResponse} response - API response
 * @returns {import('axios').AxiosResponse} Original response
 * @throws {Promise<Error>} Throws error with appropriate handling:
 * - 401: Redirects to auth page for unauthorized access
 * - 403: Logs forbidden access error
 * - 404: Logs resource not found error
 * - 500: Logs server error
 * - Network errors: Logs no response received
 * - Setup errors: Logs request configuration error
 */
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;

      // Handle 401 Unauthorized errors (token expired or invalid)
      if (status === 401) {
        console.error('Unauthorized');
        window.location.href = '/auth';
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        console.error('Access forbidden');
      }

      // Handle 404 Not Found errors
      if (status === 404) {
        console.error('Resource not found');
      }

      // Handle 500 Internal Server errors
      if (status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
