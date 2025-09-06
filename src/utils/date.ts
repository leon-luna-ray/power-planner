export const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

export const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); 

    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        
        // Format as MM-DD-YYYY with leading zeros
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${month}-${day}-${year}`;
        
        weekDates.push({
            date: date,
            dayName: weekdays[i],
            formattedDate: formattedDate,
            isToday: date.toDateString() === today.toDateString()
        });
    }

    return weekDates;
};

export const year = new Date().getFullYear();