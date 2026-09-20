document.addEventListener('DOMContentLoaded', () => {
    // Scroll animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Parallax Background Effect
    const shape1 = document.querySelector('.shape-1');
    const shape2 = document.querySelector('.shape-2');
    const shape3 = document.querySelector('.shape-3');
    const shape4 = document.querySelector('.shape-4');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Move the glowing orbs side-to-side aggressively in a fluid pattern
        if(shape1) shape1.style.transform = `translateX(${Math.sin(scrolled * 0.003) * 200}px)`;
        if(shape2) shape2.style.transform = `translateX(${Math.cos(scrolled * 0.004) * 250}px)`; 
        if(shape3) shape3.style.transform = `translateX(${Math.sin(scrolled * 0.0035) * -220}px)`;
        if(shape4) shape4.style.transform = `translateX(${Math.cos(scrolled * 0.0025) * 180}px)`;
    });
});
