let calendar;
document.addEventListener('DOMContentLoaded', () => {
    const { Calendar } = window.VanillaCalendarPro;
    const options = {
        dateMin: 'today',
        selectedTheme: 'light',
        selectionTimeMode: 12,
        selectionDatesMode: 'multiple',
        selectionDatesMode: 'multiple-ranged',
        onClickDate(self) {
            console.log(self.context.selectedDates);
        },
        onChangeTime(self) {
            console.log(self.context.selectedTime);
        },
    }
    
    calendar = new Calendar('#calendar', options);
    calendar.init();
});