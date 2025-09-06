import Dexie, { type EntityTable } from 'dexie';

interface User {
    id?: number;
    user_id: string | null; // null for local users, UUID for registered users
    email?: string;
    is_registered: boolean;
    created_at: string;
    updated_at: string;
}

interface UserSettings {
    id?: number;
    user_local_id: number; // References User.id
    dark_mode: boolean;
    timezone?: string;
    created_at: string;
    updated_at: string;
}

interface DayEntry {
    id?: number;
    user_local_id: number; // References User.id
    day: string; // 'Sunday', 'Monday', etc.
    text: string;
    created_at: string;
    updated_at: string;
}

const db = new Dexie('PowerPlannerDb') as Dexie & {
    users: EntityTable<User>;
    userSettings: EntityTable<UserSettings>;
    dayEntries: EntityTable<DayEntry>;
};

// Schema declaration:
db.version(1).stores({
    users: '++id, user_id, email, is_registered, created_at',
    userSettings: '++id, user_local_id, created_at',
    dayEntries: '++id, user_local_id, day, created_at'
});

export { db };
export type { User, UserSettings, DayEntry };