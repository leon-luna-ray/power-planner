import moment from "moment";

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for save buttons
    document.querySelectorAll<HTMLButtonElement>('.save-button').forEach(button => {
        button.addEventListener('click', function () {
            const parent = this.parentElement as HTMLElement;
            const entryTime = parent.id;
            const userEntry = parent.querySelector<HTMLInputElement>('.block-entry')?.value ?? "";

            localStorage.setItem(entryTime, userEntry);
        });
    });

    // Append current date
    const currentDay = moment().format("dddd MMMM Do YYYY");
    const currentDayElem = document.getElementById('currentDay');
    
    if (currentDayElem) currentDayElem.textContent = currentDay;

    // Update block colors based on time
    const blockEntries = document.querySelectorAll<HTMLInputElement>('.block-entry');

    if (!blockEntries.length) return;

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