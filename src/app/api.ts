import { db } from '@/app/db.ts';
import { v4 as uuidv4 } from 'uuid';
import { weekdays } from '@/utils/date.ts';
import type { DayEntry, User } from '@/types/schemas.ts';
import type { Date } from '@/types/Date.ts';

export const initializeDatabase = async (): Promise<void> => {
    try {
        await db.open();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<User> => {
    await initializeDatabase();
    // TODO refactor fetch user
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
        language: 'en',
        is_day_panel_open: {
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false
        },
        created_at: timestamp,
        updated_at: timestamp
    });

    return await db.users.get(newUser) as User;
};

export const getCurrentUiSettings = async () => {
    const user = await getCurrentUser();
    return await db.userSettings
        .where('user_local_id')
        .equals(user.id!)
        .first();
};

export const saveDayEntry = async (day: Date, text: string): Promise<void> => {
    const textString = String(text);

    const user = await getCurrentUser();
    const timestamp = new Date().toISOString();
    const existing = await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day.dayName)
        .first();

    const entryData = {
        user_local_id: user.id!,
        day: day?.dayName,
        text: textString,
        created_at: timestamp,
        updated_at: timestamp
    };

    if (existing) {
        await db.entries.update(existing.id!, {
            text: textString,
            updated_at: timestamp
        });
    } else {
        await db.entries.add(entryData);
    }
};


export const deleteDayEntry = async (day: Date): Promise<void> => {
    const msg = `Are you sure you want to delete the entry for ${day.dayName}? This action cannot be undone.`;
    if (!confirm(msg)) return;

    const user = await getCurrentUser();

    await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day.dayName)
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

    const initialized: Record<string, { text: string }> = {};

    // Initialize weekdays
    weekdays.forEach(day => {
        const entry = entries.find((e: DayEntry) => e.day === day);
        initialized[day] = { text: entry?.text || '' };
    });

    return initialized;
};
