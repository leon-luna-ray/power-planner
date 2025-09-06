const STORAGE_KEY = "power-planner";

import type { AppData } from "@/types/schemas.ts";

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

export function deleteDayEntry(day: string): void {
    const msg = `Are you sure you want to delete the entry for ${day}? This action cannot be undone.`;

    if (!confirm(msg)) return;

    const appData = getAppData();
    delete appData.entries[day];
    saveAppData(appData);
    location.reload();
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