import { db } from '@/app/db.ts';
import { v4 as uuidv4 } from 'uuid';
import { weekdays, getWeekDates } from '@/utils/date.ts';
import type { DayEntry, User } from '@/types/schemas.ts';
import type { Date } from '@/types/Date.ts';
import { getCurrentLanguage } from '@/main.ts';

// Remove this line - it's causing the circular dependency issue
// const language = getCurrentLanguage();

// Helper function to get the Monday of the current week
const getCurrentWeekMonday = (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday being 0
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0); // Reset to start of day
    return monday.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

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

export const saveDayEntry = async (day: Date, text: string): Promise<void> => {
    const textString = String(text);
    const user = await getCurrentUser();
    const timestamp = new Date().toISOString();
    const weekStartDate = getCurrentWeekMonday();

    const existing = await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day.dayName && entry.week_start_date === weekStartDate)
        .first();

    const entryData = {
        user_local_id: user.id!,
        day: day?.dayName,
        text: textString,
        week_start_date: weekStartDate,
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
    // Move the language call inside the function
    const language = getCurrentLanguage();
    
    const msg = () => {
        if (language === 'jp') {
            return `${day.dayName}のエントリを削除してもよろしいですか？この操作は元に戻せません。`;
        }
        return `Are you sure you want to delete the entry for ${day.dayName}? This action cannot be undone.`;
    }

    if (!confirm(msg())) return;

    const user = await getCurrentUser();
    const weekStartDate = getCurrentWeekMonday();

    await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.day === day.dayName && entry.week_start_date === weekStartDate)
        .delete();

    // TODO improve this to just update the relevant part of the UI
    window.location.reload();
};

export const getInitializedEntries = async (): Promise<Record<string, { text: string }>> => {
    const currentDates = getWeekDates();
    console.log('Current week dates:', currentDates);
    const user = await getCurrentUser();
    const weekStartDate = getCurrentWeekMonday();

    // Only get entries from the current week
    const entries = await db.entries
        .where('user_local_id')
        .equals(user.id!)
        .and((entry: DayEntry) => entry.week_start_date === weekStartDate)
        .toArray();

    const initialized: Record<string, { text: string }> = {};

    // Initialize weekdays - entries will be empty if not from current week
    weekdays.forEach(day => {
        const entry = entries.find((e: DayEntry) => e.day === day);
        initialized[day] = { text: entry?.text || '' };
    });

    return initialized;
};
