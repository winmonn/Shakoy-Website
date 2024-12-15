import axios from 'axios';

// Configure API instance
const API = axios.create({ baseURL: 'http://localhost:5000' });

// Task-related endpoints
export const fetchTasks = () => API.get('/tasks');
export const createTask = (task) => API.post('/tasks', task);

export const signup = (userDetails) => API.post('/users', userDetails);
export const login = (credentials) => API.post('/login', credentials);

