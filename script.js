/* ===========================================================
   ABHINOOR SINGH — FINANCIAL ANALYST
   Full JS — Navbar glitch FIXED
   =========================================================== */

// ===================== LOADER =====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 600);
        }
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
        dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    }
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (ring) {
        ring.style.transform = `translate(${ringX - 17.5}px, ${ringY - 17.5}px)`;
    }
    requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect
document.querySelectorAll('a, button, .service-card, .tool-item, .contact-card, .social-btn, .vcard-3d').forEach(el => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('hover'));
});

// ===================== NAVBAR — GLITCH FIX =====================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const allNavLinks = document.querySelectorAll('.nav-link');

// Throttled scroll — prevents rapid class toggling (THE FIX)
let lastScrollY = 0;
let ticking = false;

function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll(lastScrollY);
            ticking = false;
        });
        ticking = true;
    }
}

function handleScroll(scrollY) {
    // Navbar background — uses fixed threshold with buffer zone
    if (scrollY > 80) {
        if (!navbar.classList.contains('scrolled')) {
            navbar.classList.add('scrolled');
        }
    } else if (scrollY < 30) {
        if (navbar.classList.contains('scrolled')) {
            navbar.classList.remove('scrolled');
        }
    }
    // Note: between 30-80 = dead zone — prevents flickering

    // Back to top
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav(scrollY);
}

window.addEventListener('scroll', onScroll, { passive: true });

// Active nav link — with debounce built in
let currentActive = 'home';

function updateActiveNav(scrollY) {
    const sections = document.querySelectorAll('section[id]');
    const offset = 150; // Account for navbar height + buffer

    let newActive = currentActive;

    // Check from bottom to top so deeper sections take priority
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const top = section.offsetTop - offset;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            newActive = section.getAttribute('id');
            break;
        }
    }

    // Only update DOM if actually changed — prevents unnecessary repaints
    if (newActive !== currentActive) {
        currentActive = newActive;

        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentActive}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Back to top click
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== HAMBURGER =====================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================== SCROLL ANIMATIONS =====================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseInt(delay));

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

    document.querySelectorAll('.skill-fill').forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 300 + (index * 150));
    });
}

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
}

// ===================== COUNTER ANIMATION =====================
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            counter.textContent = Math.floor(easedProgress * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(update);
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

// ===================== CONTACT FORM → WHATSAPP =====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const whatsappMessage = encodeURIComponent(
            `Hello Abhinoor!\n\n` +
            `*Name:* ${name}\n` +
            `*Email:* ${email}\n` +
            `*Subject:* ${subject}\n` +
            `*Message:* ${message}`
        );

        const whatsappURL = `https://wa.me/918054186763?text=${whatsappMessage}`;
        window.open(whatsappURL, '_blank');

        alert(`Thank you ${name}! Redirecting to WhatsApp...`);
        contactForm.reset();
    });
}

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPos = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });
        }
    });
});

// ===================== PARALLAX (HERO ONLY — DESKTOP) =====================
const heroSection = document.querySelector('.hero');
if (heroSection && window.innerWidth > 768) {
    let parallaxTicking = false;

    heroSection.addEventListener('mousemove', (e) => {
        if (parallaxTicking) return;
        parallaxTicking = true;

        requestAnimationFrame(() => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            document.querySelectorAll('.hero-float-card').forEach((card, i) => {
                const speed = (i + 1) * 8;
                card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });

            document.querySelectorAll('.shape').forEach((shape, i) => {
                const speed = (i + 1) * 3;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });

            parallaxTicking = false;
        });
    });
                                 }
