// src/store/scheduleStore.ts
import { create } from 'zustand';
import { Schedule, APIResponse } from '../types';
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
  generateSchedule: () => Promise<void>;
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
      if (response.data && response.data.data) {
        set({
          schedule: response.data.data,
          activeScheduleId: scheduleId,
          isLoading: false
        });
      } else {
        throw new Error('Invalid schedule data received');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schedule';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  generateSchedule: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'User not authenticated', isLoading: false });
      return;
    }

    try {
      const scheduleName = `schedule_${Date.now()}`;
      const response = await scheduleAPI.generate({
        schedule_name: scheduleName,
        owner_id: user.user_id
      });

      if (response.data && response.data.data) {
        const newSchedule = response.data.data;
        set({
          schedule: newSchedule,
          activeScheduleId: newSchedule.schedule_id,
          isLoading: false
        });
        toast.success('Schedule generated successfully');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate schedule';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  updateSchedule: async () => {
    const { schedule } = get();
    if (!schedule) return;

    set({ isLoading: true, error: null });
    try {
      const response = await scheduleAPI.updateSchedule(schedule);
      if (response.data && response.data.data) {
        set({ schedule: response.data.data, isLoading: false });
        toast.success('Schedule updated successfully');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update schedule';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
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
      toast.success('Schedule deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete schedule';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  }
}));

export default useScheduleStore;
