import { db } from '@/app/db.ts';
import { v4 as uuidv4 } from 'uuid';
import type { DayEntry, User } from '@/types/schemas.ts';

export const getCurrentUser = async (): Promise<User> => {
    // Get the first user instead of assuming ID ()
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
        is_registered: false,
        created_at: timestamp,
        updated_at: timestamp
    });

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

    await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day)
        .delete();

    // TODO improve this to just update the relevant part of the UI
    window.location.reload();
};

export const getInitializedEntries = async (): Promise<Record<string, { text: string }>> => {
    const user = await getCurrentUser();
    const entries = await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .toArray();

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const initialized: Record<string, { text: string }> = {};

    // Always initialize all weekdays, even if no entries exist
    weekdays.forEach(day => {
        const entry = entries.find((e: DayEntry) => e.day === day);
        initialized[day] = { text: entry?.text || '' };
    });

    return initialized;
};
