import "@/assets/css/main.css";
import Alpine from "alpinejs";

import { saveDayEntry, deleteDayEntry, getInitializedEntries } from "@/app/api.ts";
import { day, date, getWeekDates, year } from "@/utils/date.ts";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

const userEntries = await getInitializedEntries() || {};

console.log(getWeekDates());
Alpine.store("data", {
    title: 'PowerPlanner',
    logoText: 'POWER PLANNER 95',
    subtitle: 'Digital Organization System',
    label: '🗓️ Power Planner v2.1',
    description: 'A simple planning app for scheduling your week',
    day,
    date,
    weekdays: getWeekDates(),
    year,
    saveDayEntry,
    deleteDayEntry,
    userEntries,
});

Alpine.start();
