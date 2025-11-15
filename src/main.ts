import "@/assets/css/main.css";
import Alpine from "alpinejs";

import { saveDayEntry, deleteDayEntry, getInitializedEntries } from "@/app/api.ts";
import { day, date, getWeekDates, getLocalizedDay, getLocalizedDate, year, isValidWeekday } from "@/utils/date.ts";
import { getQueryParam, setQueryParam, removeQueryParam } from "@/utils/query.ts";
import { getLocalStorageItem, setLocalStorageItem } from "./utils/localStorage.ts";
import type { Weekday } from '@/types/Date.ts';

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}

window.Alpine = Alpine;

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

const setLanguage = (lang: 'en' | 'jp') => {
    setLocalStorageItem('powerplanner-lang', lang);
};

export const getCurrentLanguage = (): 'en' | 'jp' => {
    return getLocalStorageItem('powerplanner-lang') as 'en' | 'jp' || 'en';
};

const initializeContentForLanguage = (lang: 'en' | 'jp') => {
    const selectedContent = content[lang];
    return {
        currentLanguage: lang,
        htmlLangCode: lang === 'en' ? 'en-US' : 'ja-JP',
        title: selectedContent.title,
        logoText: selectedContent.logoText,
        subtitle: selectedContent.subtitle,
        label: selectedContent.label,
        description: selectedContent.description,
        today: selectedContent.today,
        deleteBtn: selectedContent.deleteBtn,
        saveBtn: selectedContent.saveBtn,
        day: getLocalizedDay(lang),
        date: getLocalizedDate(lang),
        weekdays: getWeekDates(lang)
    };
};

const currentLang = getCurrentLanguage();
const initialContent = initializeContentForLanguage(currentLang);
const userEntries = await getInitializedEntries() || {};

const store = Alpine.reactive({
    ...initialContent,
    currentLanguage: getCurrentLanguage(),
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
    saveDayEntry,
    deleteDayEntry,
    toggleDayPanel(dayName: Weekday) {
        this.isDayPanelOpen[dayName] = !this.isDayPanelOpen[dayName];
        this.updateQueryFromPanels();
    },
    updateQueryFromPanels() {
        const openPanels = Object.entries(this.isDayPanelOpen)
            .filter(([_, isOpen]) => isOpen)
            .map(([dayName, _]) => dayName);

        if (openPanels.length > 0) {
            setQueryParam('day', openPanels.join('-'));
        } else {
            removeQueryParam('day');
        }
    },
    initializePanelsFromQuery() {
        const dayQuery = getQueryParam('day');

        if (dayQuery) {
            const dayNames = dayQuery.split('-').map(d => d.trim());

            dayNames.forEach(dayName => {
                if (!isValidWeekday(dayName)) return;
                this.isDayPanelOpen[dayName] = true;
            });

            const hasValidDays = dayNames.some(dayName => isValidWeekday(dayName));

            if (!hasValidDays) {
                this.isDayPanelOpen[day as keyof typeof this.isDayPanelOpen] = true;
                setQueryParam('day', day);
            }
        } else {
            this.isDayPanelOpen[day as keyof typeof this.isDayPanelOpen] = true;
            setQueryParam('day', day);
        }
    },
    handleLanguageChange() {
        const newLang = this.currentLanguage === "en" ? "jp" : "en";
        this.currentLanguage = newLang;
        this.htmlLangCode = newLang === 'en' ? 'en-US' : 'ja-JP';

        const newContent = content[newLang];
        this.title = newContent.title;
        this.logoText = newContent.logoText;
        this.subtitle = newContent.subtitle;
        this.label = newContent.label;
        this.description = newContent.description;
        this.today = newContent.today;
        this.deleteBtn = newContent.deleteBtn;
        this.saveBtn = newContent.saveBtn;

        this.day = getLocalizedDay(newLang);
        this.date = getLocalizedDate(newLang);
        this.weekdays = getWeekDates(newLang);

        setLanguage(newLang);
    }
});


const init = () => {
    Alpine.store("data", store);
    Alpine.start();
    store.initializePanelsFromQuery();
}

init();
