import { db, type User, type UserSettings, type DayEntry } from '@/app/db.ts';
import { v4 as uuidv4 } from 'uuid';

export const getCurrentUser = async (): Promise<User> => {
    // Get the first user instead of assuming ID 1
    let user = await db.users.orderBy('created_at').first();
    if (!user) {
        user = await createLocalUser();
    }
    return user;
};

export const createLocalUser = async (): Promise<User> => {
    const timestamp = new Date().toISOString();
    const userId = uuidv4();

    const newUser = await db.users.add({
        user_id: userId,
        is_registered: false, // Add missing required field
        created_at: timestamp,
        updated_at: timestamp
    });

    // Create default settings using the auto-generated ID
    await db.userSettings.add({
        user_local_id: newUser,
        dark_mode: false,
        created_at: timestamp,
        updated_at: timestamp
    });

    return await db.users.get(newUser) as User;
};

export const saveDayEntry = async (day: string, text: string): Promise<void> => {
    const user = await getCurrentUser();
    const timestamp = new Date().toISOString();

    // Fix: use 'entries' instead of 'dayEntries'
    const existing = await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day)
        .first();

    if (existing) {
        await db.entries.update(existing.id!, {
            text,
            updated_at: timestamp
        });
    } else {
        // Create new entry if it doesn't exist
        await db.entries.add({
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
    // Fix: use 'entries' instead of 'dayEntries'
    await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day)
        .delete();
};

export const getInitializedEntries = async (): Promise<Record<string, { text: string }>> => {
    const user = await getCurrentUser();
    const entries = await db.entries
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