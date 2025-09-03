import moment from "moment";

import { saveToLocalStorage } from "./localStorage.ts";

document.addEventListener('DOMContentLoaded', () => {
    const saveBtns = document.querySelectorAll<HTMLButtonElement>('.save-button');
    const saveHandlers: Array<(this: HTMLButtonElement, ev: MouseEvent) => void> = [];

    function setEventListeners() {
        if (!saveBtns.length) return;

        saveBtns.forEach(button => {
            const handler = function (this: HTMLButtonElement) {
                const parent = this.parentElement as HTMLElement;
                const entryTime = parent.id;
                const userEntry = parent.querySelector<HTMLInputElement>('.block-entry')?.value ?? "";
                saveToLocalStorage(entryTime, userEntry);
            };
            saveHandlers.push(handler);
            button.addEventListener('click', handler);
        });
    }

    function removeEventListeners() {
        saveBtns.forEach((button, i) => {
            const handler = saveHandlers[i];
            if (!handler) return;
            button.removeEventListener('click', handler);
        });
    }

    // Events
    window.addEventListener('beforeunload', removeEventListeners);

    // Init
    setEventListeners();

    // Append current date
    const currentDay = moment().format("dddd MMMM Do YYYY");
    const currentDayElem = document.getElementById('currentDay');

    if (currentDayElem) currentDayElem.textContent = currentDay;

    // Update block colors based on time
    const blockEntries = document.querySelectorAll<HTMLInputElement>('.block-entry');

    blockEntries.forEach(block => {
        const blockTime = block.id;
        const currentTime = moment().format("HH");
        const blockHour = parseInt(blockTime);
        const currentHour = parseInt(currentTime);

        if (blockHour === currentHour) {
            block.id = "present";
        } else if (blockHour < currentHour) {
            block.id = "past";
        } else {
            block.id = "future";
        }
    });
});