import { db } from '@/utils/db.ts';
import type { AppData } from '@/types/schemas.ts';
import type { UserSettings } from '@/types/schemas.ts';

const STORAGE_KEY = "power-planner";

export const createUser = async (): Promise<UserSettings> => {
    const timestamp = new Date().toISOString();
    const newUser: Omit<UserSettings, 'id'> = {
        user_id: null,
        dark_mode: false,
        created_at: timestamp,
        updated_at: timestamp
    };

    try {
        const id = await db.userSettings.add(newUser);
        console.log('Created new user in IndexedDB with ID:', id);
        console.log('New user data:', newUser);
        return { id, ...newUser };
    } catch (error: any) {
        console.error('Failed to create user in IndexedDB:', error);
        throw error;
    }
}

export const getAppDataTest = async () => {
    const settings = await db.userSettings.get(1);
    if (!settings) {
        console.log('No user settings found, creating a new user.');
        await createUser();
        return;
    }
    try {
        console.log('User settings from IndexedDB:', settings);
    } catch (error: any) {
        console.error('Failed to fetch user settings from IndexedDB:', error);
    }
}

export function saveAppData(data: AppData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
