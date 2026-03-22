// Initialize Page Loader
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Particles.js configuration (Optimized for performance)
if (window.innerWidth > 768 && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#e07a6c" },
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
            "opacity": { "value": 0.3, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#e07a6c", "opacity": 0.2, "width": 1 },
            "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
        },
        "retina_detect": true
    });
}

// Scroll Reveal Initialization
ScrollReveal().reveal('.anim-slide-up', {
    delay: 200,
    distance: '30px',
    duration: 800,
    easing: 'ease-out',
    origin: 'bottom',
    reset: false
});

// Theme Toggle functionality
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeBtn.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeBtn.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeBtn.classList.replace('fa-moon', 'fa-sun');
    }
}

// Mobile Menu functionality
const menuIcon = document.querySelector('.menu-icon');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

if (menuIcon && navbar) {
    const toggleMenu = () => {
        navbar.classList.toggle('active');
        menuIcon.querySelector('i').classList.toggle('fa-times');
        menuIcon.querySelector('i').classList.toggle('fa-bars');
    };

    menuIcon.addEventListener('click', toggleMenu);

    // Auto-close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

// Typing effect in Hero section
const typedTextSpan = document.querySelector(".typed-text");
const textArray = [
    "Data Analyst & Business Analyst",
    "AI Web Designer & Developer",
    "Power BI Specialist",
    "AI & Machine Learning Explorer",
    "UI/UX Designer"
];
const typingDelay = 150;
const erasingDelay = 100;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

if (typedTextSpan && textArray.length) {
    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(type, newTextDelay + 250);
    });
}

// EmailJS Integration
(function() {
    // Initializing with public key
    emailjs.init("UUp0Rf1fEHGqCVH5F"); 
})();

const contactForm = document.getElementById('contact-form');
const formStatusMsg = document.getElementById('form-message');

if (contactForm && formStatusMsg) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        
        // Step 1: Loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        formStatusMsg.innerHTML = ''; // Clear previous messages

        // Step 2: Send Form via EmailJS
        const serviceID = 'service_2kyawqf';
        const templateID = 'template_2km2zo3';

        emailjs.sendForm(serviceID, templateID, this)
            .then(function() {
                // Success Case
                formStatusMsg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
                formStatusMsg.className = 'form-status-msg show success';
                contactForm.reset(); // Reset all form fields
            }, function(error) {
                // Error Case
                formStatusMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again.';
                formStatusMsg.className = 'form-status-msg show error';
                console.error('EmailJS Error:', error);
            })
            .finally(() => {
                // Step 3: Re-enable button
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
                
                // Auto-clear message after 7 seconds
                setTimeout(() => {
                    formStatusMsg.className = 'form-status-msg';
                    setTimeout(() => {
                        formStatusMsg.innerHTML = '';
                    }, 300);
                }, 7000);
            });
    });
}

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
if (cursorDot && cursorOutline && window.innerWidth > 1024) {
    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover reaction for links and buttons
    const clickables = document.querySelectorAll('a, button, .clickable');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
} else {
    if(cursorDot) cursorDot.style.display = 'none';
    if(cursorOutline) cursorOutline.style.display = 'none';
}
