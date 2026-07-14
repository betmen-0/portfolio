document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');

    setTimeout(() => {
        loadingScreen.classList.add('.hidden');
        document.body.classList.remove('loading');
        setTimeout(() => {
            loadingScreen.remove();
        }, 300);
    }, 500);
});