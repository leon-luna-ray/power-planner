import { weekdays } from '@/utils/date.ts';
import type { Weekday } from '@/types/Date.ts';

export const getQueryParam = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

export const setQueryParam = (name: string, value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url.toString());
};

export const removeQueryParam = (name: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url.toString());
};

export const isValidWeekday = (day: string): day is Weekday => {
    return weekdays.includes(day.toLowerCase());
};