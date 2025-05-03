// src/types/index.ts
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LectureSlot {
  subject: string;
  start_time: string;
  end_time: string;
  room: string;
  day: string;
}

export interface Schedule {
  schedule_id: number;
  schedule_name: string;
  data: Record<string, LectureSlot[]>;
  owner_id: number;
  rating: number;
}

export interface APIResponse<T> {
  message?: string;
  data: T | null;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface ScheduleCreate {
  schedule_name: string;
  owner_id: number;
}

export interface ScheduleUpdate {
  owner_id: number;
  schedule_id: number;
  schedule_name: string;
  data: Record<string, LectureSlot[]>;
  rating: number;
}
