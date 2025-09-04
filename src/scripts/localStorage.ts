const STORAGE_KEY = "weekly-planner";

import type { AppData } from "../types/AppData.ts";

function getAppData(): AppData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return {
            darkMode: false,
            entries: {}
        };
    }
    try {
        const data = JSON.parse(raw);
        return {
            darkMode: data.darkMode || false,
            entries: data.entries || {}
        };
    } catch {
        return {
            darkMode: false,
            entries: {}
        };
    }
}

function saveAppData(data: AppData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveDayEntry(day: string, text: string): void {
    const appData = getAppData();
    appData.entries[day] = { text };
    saveAppData(appData);
}

export function getAllEntries(): Record<string, { text: string }> {
    return getAppData().entries;
}

export function getDarkMode(): boolean {
    return getAppData().darkMode;
}

export function setDarkMode(enabled: boolean): void {
    const appData = getAppData();
    appData.darkMode = enabled;
    saveAppData(appData);
}

export function getInitializedEntries(this: { weekdays: string[] }) {
    const stored = getAllEntries();
    const initialized: Record<string, { text: string }> = {};
    this.weekdays.forEach((day: string) => {
        initialized[day] = stored[day] || { text: '' };
    });
    return initialized;
}