import Dexie, { type EntityTable } from 'dexie';
import type { DayEntry, User, UserSettings } from '@/types/schemas.ts';

const db = new Dexie('PowerPlannerDb') as Dexie & {
    users: EntityTable<User>;
    userSettings: EntityTable<UserSettings>;
    entries: EntityTable<DayEntry>;
};

// Schema declaration:
db.version(1).stores({
    users: '++id, user_id, email, is_registered, created_at',
    userSettings: '++id, user_local_id, created_at',
    entries: '++id, user_local_id, day, text, created_at, updated_at'
});

export { db };
