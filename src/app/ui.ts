import { liveQuery } from 'dexie';
import { db } from '@/app/db.ts';
import { getCurrentUser, getCurrentUiSettings } from './api.ts';



export const updateDayPanelState = async (day: string, isOpen: boolean): Promise<void> => {
    const user = await getCurrentUser();
    const timestamp = new Date().toISOString();

    await db.userUiSettings
        .where('user_local_id')
        .equals(user.id!)
        .modify({
            [`is_day_panel_open.${day}`]: isOpen,
            updated_at: timestamp
        });
};

// Language selection
// const handleLanguageChange = () => {
//    const store = Alpine.store("data") as any;
//    const newLang = store.currentLanguage === "en" ? "jp" : "en";
//    store.currentLanguage = newLang;
   
//    // Update all text properties
//    const newContent = content[newLang];
//    store.title = newContent.title;
//    store.logoText = newContent.logoText;
//    store.subtitle = newContent.subtitle;
//    store.label = newContent.label;
//    store.description = newContent.description;
//    store.today = newContent.today;
//    store.deleteBtn = newContent.deleteBtn;
//    store.saveBtn = newContent.saveBtn;
   
//    // Update date formatting based on language
//    store.day = getLocalizedDay(newLang);
//    store.date = getLocalizedDate(newLang);
//    store.weekdays = getWeekDates(newLang);
   
//    console.log(`Language toggled to: ${newLang}`);
// };
