document.addEventListener('DOMContentLoaded', () => {
    const { Calendar } = window.VanillaCalendarPro;
    const options = {
        dateMin: 'today',
        selectedTheme: 'light',
        selectionTimeMode: 12
        /*TODO:
        display time
        display date and time range(disabled dates)
        handle events*/
    };
    
    const calendar = new Calendar('#calendar', options);
    calendar.init();
});