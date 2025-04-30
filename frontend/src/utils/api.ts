import axios from 'axios';

const API_URL = 'https://l-m-s-1-bmg6.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to requests when token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage on auth error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) => 
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  },
  
  getProfile: () => api.get('/auth/profile'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userData: { 
    username?: string; 
    firstName?: string; 
    lastName?: string; 
    email?: string;
  }) => api.put('/users/profile', userData),
  
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => 
    api.put('/users/change-password', passwordData),
};

// Book APIs
export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  
  getBook: (id: string) => api.get(`/books/${id}`),
  
  searchBooks: (query: string) => api.get(`/books/search?q=${query}`),
  
  borrowBook: (bookId: string) => api.post(`/books/${bookId}/borrow`),
  
  returnBook: (bookId: string) => api.post(`/books/${bookId}/return`),
};

export default api; 