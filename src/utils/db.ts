import Dexie, { type EntityTable } from 'dexie';
import type { UserSettings } from '@/types/schemas.ts';

const db = new Dexie('PowerPlannerDb') as Dexie & {
    userSettings: EntityTable<UserSettings>;
};

// Schema declaration:
db.version(1).stores({
    userSettings: '++id, user_id, dark_mode, created_at, updated_at'
});

export { db };