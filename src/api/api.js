import axios from 'axios';

// Configure API instance
const API = axios.create({ baseURL: 'http://localhost:3000' });

// Interceptor to attach JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Task-related endpoints
export const fetchTasks = (limit = 10, offset = 0) => API.get(`/tasks?limit=${limit}&offset=${offset}`);
export const fetchTaskById = (id) => API.get(`/tasks/${id}`);
export const createTask = (task) => API.post('/tasks', task);
export const updateTask = (id, updates) => API.put(`/tasks/${id}`, updates);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// User-related endpoints
export const signup = (userDetails) => API.post('/users/signup', userDetails);
export const login = (credentials) => API.post('/users/login', credentials);
export const fetchUsers = () => API.get('/users'); 
export const updateUser = (id, updates) => API.put(`/users/${id}`, updates);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Category-related endpoints
export const fetchCategories = () => API.get('/categories');
export const createCategory = (category) => API.post('/categories', category);
export const updateCategory = (id, updates) => API.put(`/categories/${id}`, updates);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
