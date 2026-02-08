// ===================== LOADER =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }, 2200);
});

// ===================== CUSTOM CURSOR =====================
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
        dot.style.left = mouseX - 3 + 'px';
        dot.style.top = mouseY - 3 + 'px';
    }
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    if (ring) {
        ring.style.left = ringX - 17.5 + 'px';
        ring.style.top = ringY - 17.5 + 'px';
    }

    requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
const hoverElements = document.querySelectorAll('a, button, .service-card, .tool-item, .contact-card, .social-btn, .vcard-3d');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('hover'));
});

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav();
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== HAMBURGER =====================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================== ACTIVE NAV =====================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===================== SCROLL ANIMATIONS =====================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseInt(delay));

            // Skill bars
            if (entry.target.classList.contains('skills-bars') || entry.target.closest('.skills-bars')) {
                animateSkillBars();
            }

            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
});

// ===================== SKILL BARS =====================
let skillsAnimated = false;
function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    document.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 400);
    });
}

// Observe skills section for bars
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
}

// ===================== COUNTER ANIMATION =====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = Date.now();

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const current = Math.floor(easedProgress * target);

            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }

        update();
    });
}

const statsBar = document.querySelector('.hero-stats-bar');
if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
}

// ===================== VISITING CARD FLIP =====================
const vcard = document.getElementById('vcard3d');
if (vcard) {
    vcard.addEventListener('click', () => {
        vcard.classList.toggle('flipped');
    });
}

// ===================== CONTACT FORM =====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // WhatsApp integration - sends message to Abhinoor's number
        const whatsappMessage = `Hello Abhinoor!%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
        const whatsappURL = `https://wa.me/918054186763?text=${whatsappMessage}`;

        // Open WhatsApp with the message
        window.open(whatsappURL, '_blank');

        // Also show confirmation
        alert(`Thank you ${name}! You'll be redirected to WhatsApp to send your message.`);
        contactForm.reset();
    });
}

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===================== PARALLAX ON MOUSE MOVE (HERO) =====================
const heroSection = document.querySelector('.hero');
if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const floatCards = document.querySelectorAll('.hero-float-card');
        floatCards.forEach((card, i) => {
            const speed = (i + 1) * 8;
            card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });

        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, i) => {
            const speed = (i + 1) * 3;
            shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}
