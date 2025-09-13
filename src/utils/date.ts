import type { Weekday } from '@/types/Date.ts';

// Locale-aware date formatting functions
export const getLocalizedDay = (locale: 'en' | 'jp' = 'en') => {
    const localeString = locale === 'jp' ? 'ja-JP' : 'en-US';
    return new Date().toLocaleDateString(localeString, { weekday: 'long' }).toLowerCase();
};

export const getLocalizedDate = (locale: 'en' | 'jp' = 'en') => {
    const localeString = locale === 'jp' ? 'ja-JP' : 'en-US';
    return new Date().toLocaleDateString(localeString, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

// Default exports for backward compatibility
export const day = getLocalizedDay('en');
export const date = getLocalizedDate('en');

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


export const isValidWeekday = (day: string): day is Weekday => {
    return weekdays.includes(day.toLowerCase());
};

export const getLocalizedWeekdays = (locale: 'en' | 'jp' = 'en') => {
    if (locale === 'jp') {
        return ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];
    }
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
};

export const getWeekDates = (locale: 'en' | 'jp' = 'en') => {
    const today = new Date();
    const currentDay = today.getDay();

    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);

    const localizedWeekdays = getLocalizedWeekdays(locale);
    const localeString = locale === 'jp' ? 'ja-JP' : 'en-US';

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        let formattedDate;
        if (locale === 'jp') {
            // Japanese
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}年${month}月${day}日`;
        } else {
            // US
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            formattedDate = `${month}-${day}-${year}`;
        }

        weekDates.push({
            date: date,
            dayName: getLocalizedWeekdays('en')[i],
            localizedDay: localizedWeekdays[i],
            formattedDate: formattedDate,
            isToday: date.toDateString() === today.toDateString(),
            isPast: date < today,
        });
    }

    return weekDates;
};

export const year = new Date().getFullYear();