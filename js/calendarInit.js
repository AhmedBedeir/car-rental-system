document.addEventListener('DOMContentLoaded', () => {
    const { Calendar } = window.VanillaCalendarPro;
    const options = {
        dateMin: 'today',
        selectedTheme: 'light',
    };
    
    const calendar = new Calendar('#calendar', options);
    calendar.init();
});