import axios from 'axios';

let envUrl = import.meta.env.VITE_API_URL || '';
if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
  envUrl = 'http://localhost:5000/api';
}

const API_BASE_URL = envUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 180000 // 180 seconds (3 minutes) for multi-slide AI generation
});

// Interceptor for friendly logging/errors
api.interceptors.response.use(
  response => response,
  error => {
    let errorMsg = 'API request failed';
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      errorMsg = 'AI generation is taking longer than usual. Please retry with fewer slides or try again.';
    } else {
      errorMsg = error.response?.data?.message || error.message || 'API request failed';
    }
    console.error('[API Error]:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
