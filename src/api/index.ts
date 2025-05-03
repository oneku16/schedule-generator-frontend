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

  login: async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post<APIResponse<User>>('/auth/login/', credentials);

      console.log("✅: ", res.data);

      if (res.data && res.data.data) {
        localStorage.setItem('user', JSON.stringify(res.data.data)); // storing user
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log("👤 Cached user ID:", user.user_id);
        return res.data;
      } else {
        throw new Error("No user data returned from login.");
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    }
  },
};

// Schedule API
export const scheduleAPI = {
  generate: async (params: { owner_id: number; schedule_name: string }) => {
    // const user = localStorage.getItem('user') || '{}';
    // console.log("user:", user);
    // params.owner_id = user.owner_id;
    // console.log("params:", params);
    return await api.get<APIResponse<Schedule>>('/schedule/generate/', { params })
  },

  
  getSchedule: async (params: { schedule_id?: number; schedule_name?: string }) =>
    api.get<APIResponse<Schedule>>('/schedule/get/', { params }),
  
  updateSchedule: async (scheduleData: Schedule) =>
    api.put<APIResponse<Schedule>>('/schedule/update/', scheduleData),
  
  deleteSchedule: async (scheduleId: number) =>
    api.delete<APIResponse<{ schedule_id: number }>>(`/schedule/${scheduleId}/delete`),
};

export default api;