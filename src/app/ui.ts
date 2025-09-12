// import { liveQuery } from 'dexie';
// import { db } from '@/app/db.ts';
// import { getCurrentUser, getCurrentUiSettings } from './api.ts';

// Panel Open Selection

// Add function to handle reactive panel open/close and update db in the bg

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
