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
   const newLang = store.currentLanguage === "en" ? "jp" : "en";
   store.currentLanguage = newLang;
   
   // Update all text properties
   const newContent = content[newLang];
   store.title = newContent.title;
   store.logoText = newContent.logoText;
   store.subtitle = newContent.subtitle;
   store.label = newContent.label;
   store.description = newContent.description;
   store.today = newContent.today;
   store.deleteBtn = newContent.deleteBtn;
   store.saveBtn = newContent.saveBtn;
   
   console.log(`Language toggled to: ${newLang}`);
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

const store = Alpine.reactive({
    // Current language state
    currentLanguage: 'en' as 'en' | 'jp',
    
    // Dynamic content properties (start with English)
    title: content.en.title,
    logoText: content.en.logoText,
    subtitle: content.en.subtitle,
    label: content.en.label,
    description: content.en.description,
    today: content.en.today,
    deleteBtn: content.en.deleteBtn,
    saveBtn: content.en.saveBtn,

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

Alpine.store("data", store);

Alpine.start();
