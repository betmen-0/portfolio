document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        setTimeout(() => {
            loadingScreen.remove();
        }, 300);
    }, 500);
});

let currentIndex = 0;
const initCarousel = () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    const inner = carousel.querySelector('.carousel-inner');
    const items = inner.querySelectorAll('.carousel-item');

    inner.computedStyleMap.transition = 'transform .45s ease';

    const update = () => {
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    window.moveCarousel = (direction) => {
        currentIndex = (currentIndex + direction + items.length) % items.length;
        update();
    };

    window.addEventListener('resize' , update);
    update();
};

document.addEventListener('DOMContentLoaded',() =>{
    initCarousel();
});

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const inner = carousel.querySelector('.carousel-inner');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');

    let currentIndex = 0;

    const updateCarousel = () => {
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        items.forEach((item, i) => {
            item.setAttribute('aria-hidden' , i === currentIndex ? 'false' : 'true');
        });
    };

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    updateCarousel();
});