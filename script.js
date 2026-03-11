/**
 * COMBINED SCRIPT FILE
 */

/**
 * =========================================================================
 *  CURSOR.JS
 *  Handles the custom dot/outline mouse tracking and hover expansion.
 * =========================================================================
 */

function initCursor() {
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    
    // Safety check if elements don't exist (e.g. mobile hidden via css)
    if(!cursorDot || !cursorOutline) return;

    // Track mouse coordinates to move custom cursor
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Dot follows exactly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Outline follows with a slight smooth delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Expand cursor on specific interactive elements
    const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card, .fa-bars, .fa-moon, .fa-sun, .social-media a');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}


/**
 * =========================================================================
 *  THEME.JS
 *  Handles Dark/Light mode toggle, localStorage persistence, and
 *  updates the Particles.js configuration dynamically.
 * =========================================================================
 */

function initTheme() {
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    
    if(!themeBtn) return;

    // Check Local Storage on load
    const currentTheme = localStorage.getItem('portfolio_theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeBtn.classList.replace('fa-moon', 'fa-sun');
        // Initial particle update is handled in main.js after particles load
    }

    // Toggle click event
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            themeBtn.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio_theme', 'light');
            updateParticles('light');
        } else {
            themeBtn.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio_theme', 'dark');
            updateParticles('dark');
        }
    });
}

/**
 * Updates the existing Particles.js canvas configuration
 * @param {string} theme - 'light' or 'dark'
 */
function updateParticles(theme) {
    if(!window.pJSDom || !window.pJSDom[0]) return;
    const pJS = window.pJSDom[0].pJS;
    
    if(theme === 'light') {
        pJS.particles.color.value = ["#0284c7", "#7e22ce", "#0369a1"];
        pJS.particles.line_linked.color = "#334155";
        pJS.particles.line_linked.opacity = 0.2;
    } else {
        pJS.particles.color.value = ["#00f0ff", "#8a2be2", "#00e5ff"];
        pJS.particles.line_linked.color = "#ffffff";
        pJS.particles.line_linked.opacity = 0.1;
    }
    // Forces particles.js to redraw with new colors
    pJS.fn.particlesRefresh();
}


/**
 * =========================================================================
 *  TERMINAL.JS
 *  Simulates a developer command line interface in the DOM.
 * =========================================================================
 */

function initTerminal() {
    const termInput = document.getElementById('terminal-input');
    const termBody = document.getElementById('terminal-body');
    
    if(!termInput || !termBody) return;

    // Command mapping to HTML output strings
    const commands = {
        'help': `<div class="terminal-output">Available commands:
      <span class="highlight">about</span>    - learn about Shahini
      <span class="highlight">skills</span>   - see technical skills
      <span class="highlight">projects</span> - view portfolio projects
      <span class="highlight">contact</span>  - get contact info
      <span class="highlight">clear</span>    - clear terminal</div>`,
        'about': '<div class="terminal-output">I am a Data Scientist & AI enthusiast pursuing B.Tech in CSE. I specialize in Python, ML, and Power BI.</div>',
        'skills': '<div class="terminal-output">Languages: Python, SQL, C++, Java<br>Tools: Power BI, MySQL, Git, Jupyter<br>Libs: Pandas, NumPy, Scikit-Learn</div>',
        'projects': '<div class="terminal-output">1. Hospital Analytics Dashboard (Power BI)<br>2. IMDB exploratory Data Analysis (Python)<br>3. AI Cover Letter Generator (Gemini Flash API)</div>',
        'contact': '<div class="terminal-output">Email: shahinibandaru05@gmail.com<br>Phone: +91 8096200970<br>GitHub: github.com/Shahini505</div>',
    };

    termInput.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            const val = this.value.trim().toLowerCase();
            this.value = ''; // Reset input
            
            // Append the User Command line to history
            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.innerHTML = `<span class="prompt">shahini@portfolio:~$</span> ${val}`;
            termBody.appendChild(userLine);
            
            // Handle special clear command
            if(val === 'clear') {
                termBody.innerHTML = '';
                return;
            }
            
            if(val === '') return;
            
            // Simulate standard terminal processing delay
            setTimeout(() => {
                const response = document.createElement('div');
                if(commands[val]) {
                    response.innerHTML = commands[val];
                } else {
                    response.innerHTML = `<div class="terminal-output" style="color:#ff5f56">Command not found: ${val}. Type 'help' for a list of commands.</div>`;
                }
                termBody.appendChild(response);
                termBody.scrollTop = termBody.scrollHeight; // Auto-scroll to bottom
            }, 300);
            
            termBody.scrollTop = termBody.scrollHeight;
        }
    });
}


/**
 * =========================================================================
 *  CHAT.JS
 *  Handles the Floating AI Assistant logic, opening/closing, and 
 *  processing user input through simple keyword matching.
 * =========================================================================
 */

function initChat() {
    const aiTrigger = document.getElementById('ai-trigger');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiClose = document.getElementById('close-chat');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiBody = document.getElementById('ai-body');
    
    if(!aiTrigger || !aiChatWindow) return;

    // Toggle Chat Window visibility
    aiTrigger.addEventListener('click', () => {
        aiChatWindow.classList.add('active');
        aiInput.focus();
    });
    
    aiClose.addEventListener('click', () => {
        aiChatWindow.classList.remove('active');
    });
    
    /**
     * Appends a message bubble to the chat body
     * @param {string} text - Message content
     * @param {string} sender - 'bot' or 'user'
     */
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${sender}`;
        msgDiv.textContent = text;
        aiBody.appendChild(msgDiv);
        aiBody.scrollTop = aiBody.scrollHeight;
    }
    
    /** Shows bouncing dots animation before bot replies */
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        aiBody.appendChild(typingDiv);
        aiBody.scrollTop = aiBody.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();
    }
    
    /**
     * Rudimentary keyword matching to simulate AI knowledge
     * @param {string} input - User query
     */
    function processAIResponse(input) {
        const text = input.toLowerCase();
        let response = "I'm sorry, I don't have information on that. Try asking about Shahini's skills, projects, or contact details!";
        
        // Exact Phrase Checks
        if (text.includes("what projects did") || text.includes('project') || text.includes('portfolio') || text.includes('build') || text.includes('made')) {
            response = "She has built awesome projects like a Hospital Analytics Dashboard in Power BI, IMDB Data Analysis, and an AI Cover Letter Generator!";
        } else if (text.includes("what skills does") || text.includes('skill') || text.includes('python') || text.includes('java') || text.includes('tech')) {
            response = "Shahini is highly skilled in Python, SQL, C++, Java, and Power BI. She's great at Data Cleaning and ML Basics!";
        } else if (text.includes("how can i contact") || text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('reach')) {
            response = "You can reach her at shahinibandaru05@gmail.com or call +91 8096200970. She's based in Andhra Pradesh, India.";
        } else if (text.includes('education') || text.includes('study') || text.includes('college') || text.includes('university') || text.includes('btech')) {
            response = "She is currently pursuing her B.Tech in CSE at Lovely Professional University with brilliant standing!";
        } else if (text.includes('hi') || text.includes('hello') || text.includes('who are you')) {
            response = "Hello there! I'm Shahini's AI assistant. I can answer questions like 'What projects did Shahini build?' or 'How can I contact Shahini?'";
        }
        
        showTypingIndicator();
        
        // Simulate network delay to make the bot feel real
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage(response, 'bot');
        }, 1200);
    }
    
    // Event listeners for sending queries
    function handleSend() {
        const text = aiInput.value.trim();
        if(!text) return;
        aiInput.value = ''; // clear input
        
        appendMessage(text, 'user');
        processAIResponse(text);
    }
    
    aiSend.addEventListener('click', handleSend);
    aiInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') handleSend();
    });
}


/**
 * =========================================================================
 *  EFFECTS.JS
 *  Handles 3D Card tilting, scroll-based animations (navbar, skills fill),
 *  and the typing effect on the hero section.
 * =========================================================================
 */

function initEffects() {
    // --- 3D Tilt Effect for Project Cards ---
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            // Mouse position relative to the card
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            // Center coordinates of the card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation degrees (max 10deg tilt for subtlety)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // --- Scroll Observers (Navbar & Progress bars) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const header = document.querySelector('header');
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');

    window.addEventListener('scroll', () => {
        let top = window.scrollY;
        
        // Active Link Highlighting
        sections.forEach(sec => {
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if(top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    let targetLink = document.querySelector(`header nav a[href*=${id}]`);
                    if(targetLink) targetLink.classList.add('active');
                });
                
                // Animate progress bars only when skills section scrolls into view
                if(id === 'skills') {
                    document.querySelectorAll('.skill-bar .progress').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
            }
        });

        // Sticky Header toggle
        header.classList.toggle('sticky', top > 100);
        
        // Simple Parallax for Background Blobs
        if(blob1 && blob2) {
            blob1.style.transform = `translateY(${top * 0.2}px)`;
            blob2.style.transform = `translateY(${top * -0.1}px)`;
        }
    });

    // --- Typing Effect (Hero Subtitle) ---
    const textElement = document.querySelector('.multiple-text');
    const words = ['Data Scientist', 'Machine Learning Enthusiast', 'Aspiring Data Scientist & AI Enthusiast'];
    let wordIndex = 0; 
    let charIndex = 0; 
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        // Add or remove characters based on state
        if (isDeleting) { 
            textElement.textContent = currentWord.substring(0, charIndex - 1); 
            charIndex--; 
        } else { 
            textElement.textContent = currentWord.substring(0, charIndex + 1); 
            charIndex++; 
        }
        
        // Speed settings
        let typeSpeed = isDeleting ? 40 : 100;
        
        // State transitions (Finished typing word vs Finished deleting word)
        if (!isDeleting && charIndex === currentWord.length) { 
            typeSpeed = 2000; // Pause at the end of word
            isDeleting = true; 
        } else if (isDeleting && charIndex === 0) { 
            isDeleting = false; 
            wordIndex = (wordIndex + 1) % words.length; 
            typeSpeed = 500; // Pause before new word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing after 1 second delay
    if(textElement) setTimeout(typeEffect, 1000);
}


/**
 * =========================================================================
 *  CONTACT.JS
 *  Handles custom form validation, prevents default submissions,
 *  and sends messages using the EmailJS framework.
 * =========================================================================
 */

function initContact() {
    // 1. Initialize EmailJS with Public Key
    // NOTE: You must replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key.
    // For this demonstration, we are mocking the initialization since we don't have keys.
    if(typeof emailjs !== 'undefined') {
        // emailjs.init("YOUR_PUBLIC_KEY");
    }

    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    if(!form) return;

    form.addEventListener('submit', function(e) {
        // Prevent natural page reload
        e.preventDefault();

        // 2. Custom Validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        statusMsg.classList.remove('show', 'error', 'success');
        
        // Simple regex array validations
        if(!name || !email || !subject || !message) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }
        
        if(!/^\S+@\S+\.\S+$/.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // 3. UI Sending State
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin" style="margin-left: 1rem;"></i>';
        submitBtn.style.pointerEvents = 'none';

        // 4. Send Email via EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual EmailJS IDs
        // We simulate the API call here with a Timeout for demonstration
        
        /* 
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            .then(function() {
                showStatus('Message sent successfully!', 'success');
                form.reset();
                resetBtn();
            }, function(error) {
                showStatus('Failed to send message. Please try again.', 'error');
                resetBtn();
            });
        */
        
        // --- Simulated Network Request (Delete when using real keys) ---
        setTimeout(() => {
            showStatus('Message sent successfully! (Simulated)', 'success');
            form.reset();
            resetBtn();
        }, 1500);
        
        function resetBtn() {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.pointerEvents = 'all';
            
            // Auto hide success message after 5 seconds
            setTimeout(() => {
                statusMsg.classList.remove('show');
            }, 5000);
        }
    });

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.className = `form-status-msg show ${type}`;
    }
}


/**
 * =========================================================================
 *  MAIN.JS (Entry Point)
 *  Imports all sub-modules and initializes the portfolio logic.
 * =========================================================================
 */


document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize custom modules
    initCursor();
    initTheme();
    initTerminal();
    initChat();
    initEffects();
    initContact();

    // 2. Mobile Menu Toggle Logic
    const menuIcon = document.querySelector('.menu-icon');
    const navbar = document.querySelector('.navbar');

    if(menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.querySelector('i').classList.toggle('fa-xmark');
            navbar.classList.toggle('active');
        });

        // Close menu on scroll or click
        window.addEventListener('scroll', () => {
            menuIcon.querySelector('i').classList.remove('fa-xmark');
            navbar.classList.remove('active');
        });
        
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.querySelector('i').classList.remove('fa-xmark');
                navbar.classList.remove('active');
            });
        });
    }

    // 3. Initialize Particles.js Background
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                // Use CSS variables for default colors
                "color": { "value": ["#00f0ff", "#8a2be2", "#00e5ff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
                "size": { "value": 4, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { 
                    "onhover": { "enable": true, "mode": "grab" }, 
                    "onclick": { "enable": true, "mode": "push" }, 
                    "resize": true 
                },
                "modes": { 
                    "grab": { "distance": 200, "line_linked": { "opacity": 0.3 } }, 
                    "push": { "particles_nb": 4 } 
                }
            },
            "retina_detect": true
        });

        // If light mode is active on load, update particles color
        if(document.body.classList.contains('light-mode') && window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;
            pJS.particles.color.value = ["#0284c7", "#7e22ce", "#0369a1"];
            pJS.particles.line_linked.color = "#334155";
            pJS.particles.line_linked.opacity = 0.2;
            pJS.fn.particlesRefresh();
        }
    }

    // 4. Initialize ScrollReveal.js Animations
    if(typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({ distance: '60px', duration: 2000, delay: 100, reset: false });
        // Slide down
        sr.reveal('.heading', { origin: 'top' });
        // Slide up
        sr.reveal('.about-grid, .timeline-container, .skills-container, .projects-grid, .certificates-grid, .contact-container, .terminal-window', { origin: 'bottom', distance: '100px' });
        // Slide right
        sr.reveal('.home-content h1', { origin: 'left', distance: '100px' });
        // Slide left
        sr.reveal('.home-content p', { origin: 'right' });
    }
});


