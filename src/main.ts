import "@/assets/css/main.css";
import Alpine from "alpinejs";

import { saveDayEntry, deleteDayEntry, getInitializedEntries } from "@/app/api.ts";
import { day, date, getWeekDates, getLocalizedDay, getLocalizedDate, year } from "@/utils/date.ts";
import type { Weekday } from '@/types/Date.ts';
import { getCurrentUiSettings } from '@/app/api.ts'

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

const userEntries = await getInitializedEntries() || {};
const userSettings = await getCurrentUiSettings();

const handleClick = () => {
    console.log('Button clicked');
    console.log(userSettings)
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
    year,
    userEntries,
    isDayPanelOpen: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
    },
    weekdays: getWeekDates(),
    saveDayEntry,
    deleteDayEntry,
    handleClick,
    toggleDayPanel(dayName: Weekday) {
        this.isDayPanelOpen[dayName] = !this.isDayPanelOpen[dayName];
    },
});

const openTodayPanel = () => {
    store.isDayPanelOpen[day as keyof typeof store.isDayPanelOpen] = true;
};

const init = () => {
    Alpine.store("data", store);
    Alpine.start();
    openTodayPanel();
}

init();
