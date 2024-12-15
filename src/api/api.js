import axios from 'axios';

// Configure API instance
const API = axios.create({ baseURL: 'http://localhost:3000' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token && !['/users/signup', '/users/login'].includes(req.url)) {
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
export const signup = async (userDetails) => {
    console.log('Sending Signup Request:', userDetails); 
    try {
        const response = await API.post('/users/signup', userDetails);
        console.log('Signup API Response:', response.data); 
        return response.data; 
    } catch (error) {
        console.error('Signup API Error:', error.response?.data || error.message); 
        throw error;
    }
};
export const login = (credentials) => API.post('/users/login', credentials);
export const fetchUsers = () => API.get('/users'); 
export const updateUser = (id, updates) => API.put(`/users/${id}`, updates);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Category-related endpoints
export const fetchCategories = () => API.get('/categories');
export const createCategory = (category) => API.post('/categories', category);
export const updateCategory = (id, updates) => API.put(`/categories/${id}`, updates);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
