//Show toast
export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = `toast-${Date.now()}` 
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    ` 
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show() 
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

//Toggle between login and registration
export function toggleRegisterLogin() {
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const registerLinkContainer = document.getElementById('register-link-container');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    
    if (showRegisterLink && showLoginLink && confirmPasswordContainer) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleConfirmPassword(confirmPasswordContainer, registerLinkContainer, true);
        });
        
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleConfirmPassword(confirmPasswordContainer, registerLinkContainer, false);
        });
    }
}

//Toggle the confirm password
export function toggleConfirmPassword(confirmPasswordContainer, registerLinkContainer, showConfirmPassword) {
    if (showConfirmPassword) {
        confirmPasswordContainer.style.display = 'block';
        registerLinkContainer.style.display = 'none';
    }
    else {
        confirmPasswordContainer.style.display = 'none';
        registerLinkContainer.style.display = 'block';
    }
}