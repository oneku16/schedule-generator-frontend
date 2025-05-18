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

export type Quarter = 1 | 2 | 3 | 4;
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  color?: string;
}

export interface Cell {
  id: string;
  quarter: Quarter;
  day: Day;
  lecture: Lecture | null;
}

export interface Cohort {
  id: string;
  name: string;
  cells: Cell[];
}

export interface Schedule {
  schedule_id: number;
  schedule_name: string;
  data: Record<string, Cell[]>;
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
  data: Record<string, any>;
  rating: number;
}