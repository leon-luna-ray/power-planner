import { saveToLocalStorage } from "./localStorage.ts";

const template = (day: string, index: number) => {
    // Create the elements directly instead of using innerHTML
    const li = document.createElement('li');
    li.id = day;
    li.className = "row time-blocks border-black border-[4px]";

    const hourDiv = document.createElement('div');
    hourDiv.className = "col-md-1 hour";
    hourDiv.textContent = day;

    const textarea = document.createElement('textarea');
    textarea.className = "col-md-10 block-entry";

    const button = document.createElement('button');
    button.className = "col-md-1 save-button";
    button.setAttribute('data-day', day);
    button.innerHTML = '<i class="fas fa-save"></i>';

    // Add event listener directly
    button.addEventListener('click', () => {
        saveToLocalStorage(day, textarea.value);
    });

    li.appendChild(hourDiv);
    li.appendChild(textarea);
    li.appendChild(button);

    return li;
};

function renderBlocks() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const list = document.querySelector('#time-blocks');
    if (!list) return;
    list.innerHTML = ''; // Clear previous blocks
    days.forEach((day, i) => {
        const block = template(day, i);
        list.appendChild(block);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBlocks();
});