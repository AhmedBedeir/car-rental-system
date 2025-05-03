//this file is basically to select some of the 
// calendar classes because they're not accessible in css
//Set up range hover effects for time inputs
export function rangeHoverEffects() {
    const ranges = [
        { selector: 'label[data-vc-time-range="hour"] input', inputSelector: 'label[data-vc-time-input="hour"] input' },
        { selector: 'label[data-vc-time-range="minute"] input', inputSelector: 'label[data-vc-time-input="minute"] input' }
    ];
    
    ranges.forEach(({ selector, inputSelector }) => {
        const range = document.querySelector(selector);
        const input = document.querySelector(inputSelector);
        
        if (range && input) {
            range.addEventListener('mouseenter', () => changeInputBackground(input, true));
            range.addEventListener('mouseleave', () => changeInputBackground(input, false));
        }
    });
}

//Change input background color on hover
export function changeInputBackground(input, isHovered) {
    if (isHovered) {
        input.style.backgroundColor = 'var(--border-color)';
    } else {
        input.style.backgroundColor = '';
    }
}