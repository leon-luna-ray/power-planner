const STORAGE_KEY = "workday-scheduler";

export function saveDayEntry(day: string, text: string): void {
    const data = getAllEntries();
    data[day] = { text };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAllEntries(): Record<string, { text: string }> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}