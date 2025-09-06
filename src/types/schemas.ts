// Base interfaces that work for all storage solutions
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PlanEntry {
  id: string;
  user_id: string | null; // null for local storage
  day: string; // 'monday', 'tuesday', etc.
  text: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string | null; // null for local storage
  dark_mode: boolean;
  created_at: string;
  updated_at: string;
}

// Legacy interface for backward compatibility
export interface AppData {
  darkMode: boolean;
  entries: Record<string, { text: string }>;
}