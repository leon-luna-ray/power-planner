import Alpine from "alpinejs";

import { saveDayEntry, deleteDayEntry, getInitializedEntries } from "@/app/api.ts";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

const userEntries = await getInitializedEntries() || {};

Alpine.store("data", {
    title: 'Power Planner',
    logoText: 'POWER PLANNER 95',
    subtitle: 'Digital Organization System',
    label: '🗓️ Power Planner v2.1',
    description: 'A simple planning app for scheduling your week',
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    year: new Date().getFullYear(),
    saveDayEntry,
    deleteDayEntry,
    userEntries,
});

Alpine.start();
