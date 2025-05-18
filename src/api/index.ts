import axios from 'axios';
import { User, Schedule, APIResponse } from '../types';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) => 
    api.post<APIResponse<User>>('/auth/create/', userData),
  
  login: (credentials: { email: string; password: string }) => 
    api.post<APIResponse<User>>('/auth/login/', credentials),
};

// Schedule API
export const scheduleAPI = {
  generate: (params: { owner_id: number; schedule_name: string }) => 
    api.get<APIResponse<Schedule>>('/schedule/generate/', { params }),
  
  getSchedule: (params: { schedule_id?: number; schedule_name?: string }) => 
    api.get<APIResponse<Schedule>>('/schedule/get/', { params }),
  
  updateSchedule: (scheduleData: Schedule) => 
    api.put<APIResponse<Schedule>>('/schedule/update/', scheduleData),
  
  deleteSchedule: (scheduleId: number) => 
    api.delete<APIResponse<{ schedule_id: number }>>(`/schedule/${scheduleId}/delete`),
};

export default api;