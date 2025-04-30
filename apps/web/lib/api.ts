import api from './axios';

/**
 * Generic HTTP request functions using axios instance
 * @module api
 */

/**
 * Makes a GET request to the specified URL
 * @async
 * @template T Response data type
 * @param {string} url - The endpoint URL
 * @param {Record<string, any>} [params] - Optional query parameters
 * @returns {Promise<T>} Response data
 */
export const get = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

/**
 * Makes a POST request to the specified URL
 * @async
 * @template T Response data type
 * @param {string} url - The endpoint URL
 * @param {any} [data] - Optional request body data
 * @returns {Promise<T>} Response data
 */
export const post = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.post<T>(url, data);
  return response.data;
};

/**
 * Makes a PUT request to the specified URL
 * @async
 * @template T Response data type
 * @param {string} url - The endpoint URL
 * @param {any} [data] - Optional request body data
 * @returns {Promise<T>} Response data
 */
export const put = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.put<T>(url, data);
  return response.data;
};

/**
 * Makes a PATCH request to the specified URL
 * @async
 * @template T Response data type
 * @param {string} url - The endpoint URL
 * @param {any} [data] - Optional request body data
 * @returns {Promise<T>} Response data
 */
export const patch = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.patch<T>(url, data);
  return response.data;
};

/**
 * Makes a DELETE request to the specified URL
 * @async
 * @template T Response data type
 * @param {string} url - The endpoint URL
 * @returns {Promise<T>} Response data
 */
export const del = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};

/**
 * Default export of all HTTP methods
 */
export default {
  get,
  post,
  put,
  patch,
  del,
};
