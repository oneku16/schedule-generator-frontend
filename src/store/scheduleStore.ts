import { create } from 'zustand';
import { Schedule, ScheduleItem } from '../types';
import { scheduleAPI } from '../api';
import { toast } from 'react-hot-toast';
import useAuthStore from './authStore';

interface ScheduleState {
  schedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  activeScheduleId: number | null;
}

interface ScheduleStore extends ScheduleState {
  fetchSchedule: (scheduleId: number) => Promise<void>;
  generateSchedule: (scheduleName: string) => Promise<void>;
  updateSchedule: () => Promise<void>;
  deleteSchedule: (scheduleId: number) => Promise<void>;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedule: null,
  isLoading: false,
  error: null,
  activeScheduleId: null,
  
  fetchSchedule: async (scheduleId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await scheduleAPI.getSchedule({ schedule_id: scheduleId });
      set({ 
        schedule: response.data,
        activeScheduleId: scheduleId,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schedule';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  generateSchedule: async (scheduleName) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      throw new Error('User not authenticated');
    }
    
    try {
      const scheduleName = `schedule_${Date.now()}`;
      const response = await scheduleAPI.generate({
        schedule_name: scheduleName,
        owner_id: user.user_id
      });
      set({ 
        schedule: response.data,
        activeScheduleId: response.data.schedule_id,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate schedule';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  updateSchedule: async () => {
    const { schedule } = get();
    if (!schedule) {
      throw new Error('No schedule to update');
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await scheduleAPI.updateSchedule(schedule);
      set({ schedule: response.data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update schedule';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  
  deleteSchedule: async (scheduleId) => {
    set({ isLoading: true, error: null });
    try {
      await scheduleAPI.deleteSchedule(scheduleId);
      set({ 
        schedule: null, 
        activeScheduleId: null,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete schedule';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));

export default useScheduleStore;