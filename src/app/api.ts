import { db, type User, type UserSettings, type DayEntry } from './db.ts';

export const getCurrentUser = async (): Promise<User> => {
    let user = await db.users.get(1);
    if (!user) {
        user = await createLocalUser();
    }
    return user;
};

export const createLocalUser = async (): Promise<User> => {
    const timestamp = new Date().toISOString();
    
    const userId = await db.users.add({
        user_id: null,
        is_registered: false,
        created_at: timestamp,
        updated_at: timestamp
    });

    // Create default settings
    await db.userSettings.add({
        user_local_id: userId,
        dark_mode: false,
        created_at: timestamp,
        updated_at: timestamp
    });

    return await db.users.get(userId) as User;
};

export const saveDayEntry = async (day: string, text: string): Promise<void> => {
    const user = await getCurrentUser();
    const timestamp = new Date().toISOString();
    
    const existing = await db.dayEntries
        .where('user_local_id')
        .equals(user.id!)
        .and(entry => entry.day === day)
        .first();

    if (existing) {
        await db.dayEntries.update(existing.id!, {
            text,
            updated_at: timestamp
        });
    } else {
        await db.dayEntries.add({
            user_local_id: user.id!,
            day,
            text,
            created_at: timestamp,
            updated_at: timestamp
        });
    }
};

export const deleteDayEntry = async (day: string): Promise<void> => {
    const msg = `Are you sure you want to delete the entry for ${day}? This action cannot be undone.`;
    if (!confirm(msg)) return;

    const user = await getCurrentUser();
    await db.dayEntries
        .where('user_local_id')
        .equals(user.id!)
        .and(entry => entry.day === day)
        .delete();
};

export const getInitializedEntries = async (): Promise<Record<string, { text: string }>> => {
    const user = await getCurrentUser();
    const entries = await db.dayEntries
        .where('user_local_id')
        .equals(user.id!)
        .toArray();
    
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const initialized: Record<string, { text: string }> = {};
    
    weekdays.forEach(day => {
        const entry = entries.find(e => e.day === day);
        initialized[day] = { text: entry?.text || '' };
    });
    
    return initialized;
};

export const loadAppData = async (): Promise<void> => {
    const user = await getCurrentUser();
    console.log('Current user:', user);
};
