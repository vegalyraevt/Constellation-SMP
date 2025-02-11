document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-top-subtle, .fade-in-bottom-subtle, .fade-in-subtle');

    function checkVisibility() {
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 1.2 && rect.bottom > 0) { // Adjusted to 120% of the viewport height
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100); // Delay each element by 100ms
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check

    // Mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('nav');

    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('navshow');
    });
});
