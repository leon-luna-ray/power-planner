import { saveDayEntry, getAllEntries } from "./localStorage.ts";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function template(day: string, text: string) {
    const li = document.createElement('li');
    li.id = day;
    li.className = "row time-blocks border-black border-[4px]";

    const hourDiv = document.createElement('div');
    hourDiv.className = "col-md-1 hour";
    hourDiv.textContent = day;

    const textarea = document.createElement('textarea');
    textarea.className = "col-md-10 block-entry";
    textarea.value = text;

    const button = document.createElement('button');
    button.className = "col-md-1 save-button";
    button.setAttribute('data-day', day);
    button.innerHTML = '<i class="fas fa-save"></i>';

    button.addEventListener('click', () => {
        saveDayEntry(day, textarea.value);
    });

    li.appendChild(hourDiv);
    li.appendChild(textarea);
    li.appendChild(button);

    return li;
}

function renderBlocks() {
    const list = document.querySelector('#time-blocks');
    if (!list) return;
    list.innerHTML = '';
    const entries = getAllEntries();
    days.forEach(day => {
        const text = entries[day]?.text || "";
        const block = template(day, text);
        list.appendChild(block);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBlocks();
});