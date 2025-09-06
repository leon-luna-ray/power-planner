import Alpine from "alpinejs";

import { saveDayEntry, deleteDayEntry, getInitializedEntries } from "@/utils/localStorage.ts";
import { loadAppData as handleClick } from "@/app/api.ts";


declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

Alpine.store("data", {
    title: 'Power Planner',
    logo: '╔══ POWER PLANNER 95 ══╗',
    subtitle: 'Digital Organization System',
    label: '🗓️ Power Planner v2.1',
    description: 'A simple planning app for scheduling your week',
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    year: new Date().getFullYear(),
    saveDayEntry,
    deleteDayEntry,
    getInitializedEntries,
    autoResize,
    handleClick,
});

Alpine.start();
// loadAppData();
