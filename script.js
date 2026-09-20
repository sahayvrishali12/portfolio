
// --- Mobile Menu Toggle ---
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            navLinks.classList.remove('active');
        });
    });
}

// --- Active Nav Item on Scroll ---
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

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

// --- Modal Functions (Global scope so inline onclick works) ---
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.showModal();
        document.body.style.overflow = 'hidden'; // Prevent scrolling underneath
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.close();
        document.body.style.overflow = '';
    }
}

// Close modal when clicking on backdrop
document.querySelectorAll('.case-study-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeModal(modal.id);
        }
    });
});

// --- Let's Connect Button Proximity Darkening ---
const connectBtn = document.querySelector('.lets-connect-btn');
if (connectBtn) {
    const maxDist = 200; // slightly smaller radius so it doesn't affect the whole page
    
    function resetBtn() {
        connectBtn.style.backgroundColor = '';
        connectBtn.style.color = '';
    }

    document.addEventListener('mousemove', (e) => {
        const rect = connectBtn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(Math.pow(e.clientX - btnX, 2) + Math.pow(e.clientY - btnY, 2));
        
        if (distance < maxDist) {
            const intensity = 1 - (distance / maxDist);
            // Non-linear easing for a smoother, more tasteful effect (squares the intensity)
            const easedIntensity = Math.pow(intensity, 2); 
            
            connectBtn.style.backgroundColor = `rgba(17, 17, 17, ${easedIntensity})`;
            
            // Blend text to white
            const textVal = Math.floor(17 + (238 * easedIntensity)); 
            connectBtn.style.color = `rgb(${textVal}, ${textVal}, ${textVal})`;
        } else {
            resetBtn();
        }
    });

    document.addEventListener('mouseleave', resetBtn);
}


// --- Background Expandable Items ---
document.querySelectorAll('.expand-btn, .expand-btn-text').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const details = e.target.previousElementSibling;
        if (details.classList.contains('expanded')) {
            details.classList.remove('expanded');
            e.target.textContent = '+ View details';
        } else {
            details.classList.add('expanded');
            e.target.textContent = '- Hide details';
        }
    });
});


// --- Contact Form Submission ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const statusDiv = document.getElementById('formStatus');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('msg').value;
        const honeypot = document.getElementById('honeypot').value;

        // Simple client-side validation
        if (!name || !email || !subject || !message) {
            statusDiv.textContent = 'Please fill out all required fields.';
            statusDiv.style.color = 'red';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            statusDiv.textContent = 'Please enter a valid email address.';
            statusDiv.style.color = 'red';
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Sending...';
        statusDiv.textContent = '';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message, honeypot })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                statusDiv.textContent = data.message;
                statusDiv.style.color = 'green';
                contactForm.reset();
            } else {
                statusDiv.textContent = data.message || 'Something went wrong. Please try again.';
                statusDiv.style.color = 'red';
            }
        } catch (err) {
            statusDiv.textContent = 'Network error. Please try again later.';
            statusDiv.style.color = 'red';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send Message';
        }
    });
}
