
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
  user_local_id: number; // References User.id
  dark_mode: boolean;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

// Legacy interface for backward compatibility
export interface AppData {
  darkMode: boolean;
  entries: Record<string, { text: string }>;
}