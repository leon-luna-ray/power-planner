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

type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const isDayOpen: Record<Weekday, boolean> = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
};

const handleClick = () => {
   const store = Alpine.store("data") as any;
   currentLanguage = currentLanguage === "en" ? "jp" : "en";
   store.currentLanguage = currentLanguage;
   console.log(`Language toggled to: ${currentLanguage}`);
};

const setIsDayOpen = (day: Weekday, value: boolean) => {
    isDayOpen[day] = value;
};

// Language content
const content = {
    en: {
        title: 'PowerPlanner',
        logoText: 'POWER PLANNER 95',
        subtitle: 'Digital Organization System',
        label: '🗓️ Power Planner v2.1',
        description: 'A simple planning app for scheduling your week',
        today: 'Today:',
        deleteBtn: 'Delete',
        saveBtn: 'Save'
    },
    jp: {
        title: 'パワープランナー',
        logoText: 'パワープランナー95',
        subtitle: 'デジタル組織システム',
        label: '🗓️ パワープランナー v2.1',
        description: 'あなたの週を計画するためのシンプルなアプリ',
        today: '今日:',
        deleteBtn: '削除',
        saveBtn: '保存'
    }
} as const;

type Language = 'en' | 'jp';
let currentLanguage: Language = 'en';

const getText = (key: keyof typeof content.en): string => {
    return content[currentLanguage][key];
};

Alpine.store("data", {
    // Current language state
    currentLanguage: 'en',
    
    // Dynamic content getters
    get title() { return getText('title'); },
    get logoText() { return getText('logoText'); },
    get subtitle() { return getText('subtitle'); },
    get label() { return getText('label'); },
    get description() { return getText('description'); },
    get today() { return getText('today'); },
    get deleteBtn() { return getText('deleteBtn'); },
    get saveBtn() { return getText('saveBtn'); },
    
    // Legacy properties for backward compatibility
    titleJp: 'パワープランナー',
    logoTextJp: 'パワープランナー95',
    subtitleJp: 'デジタル組織システム',
    labelJp: '🗓️ パワープランナー v2.1',
    descriptionJp: 'あなたの週を計画するためのシンプルなアプリ',
    
    day,
    date,
    weekdays: getWeekDates(),
    year,
    saveDayEntry,
    deleteDayEntry,
    userEntries,
    isDayOpen,
    handleClick,
});

Alpine.start();
