import Alpine from "alpinejs";

import { saveDayEntry, getInitializedEntries } from "./scripts/localStorage.ts";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

Alpine.store("data", {
    title: 'Weekly Planner',
    description: 'A simple calendar app for scheduling your work week',
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    year: new Date().getFullYear(),
    saveDayEntry,
    getInitializedEntries,
});

Alpine.start();
