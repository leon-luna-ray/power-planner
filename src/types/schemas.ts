
export interface DayEntry {
  id?: number;
  user_local_id: number;
  day: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id?: number;
  user_id: string | null; // null for local users, UUID for registered users
  email?: string;
  is_registered: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id?: number;
  user_local_id: number;
  timezone?: string;
  language: string;
  is_dark_mode: boolean;
  is_day_panel_open: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  created_at: string;
  updated_at: string;
}
