/* =============================================================
   ABHINOOR SINGH — FINANCIAL ANALYST
   Pure Vanilla JS — No Libraries
   Everything visible by default. JS adds animation polish.
   ============================================================= */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       0. INJECT ANIMATION CSS
       (So we don't touch the main style.css)
    ---------------------------------------------------------- */
    const animCSS = document.createElement('style');
    animCSS.textContent = `
        /* ===== Reveal Animation Base ===== */
        .reveal-hidden {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                        transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }

        .reveal-hidden.from-left {
            transform: translateX(-60px);
        }

        .reveal-hidden.from-right {
            transform: translateX(60px);
        }

        .reveal-hidden.from-scale {
            transform: scale(0.6);
        }

        .reveal-hidden.from-scale-up {
            transform: scale(0.85) translateY(30px);
        }

        .reveal-visible {
            opacity: 1 !important;
            transform: translateY(0) translateX(0) scale(1) !important;
        }

        /* ===== Hero Char Animation ===== */
        .hero-char {
            display: inline-block;
            opacity: 0;
            transform: translateY(100%);
            transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1),
                        transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .hero-char.char-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* ===== Floating Animation ===== */
        @keyframes floatUp {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
        }

        @keyframes floatUpSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .float-anim-1 { animation: floatUp 3.5s ease-in-out infinite; }
        .float-anim-2 { animation: floatUp 4s ease-in-out infinite 0.5s; }
        .float-anim-3 { animation: floatUpSlow 3s ease-in-out infinite 1s; }

        /* ===== Particle ===== */
        @keyframes particleFloat {
            0% { opacity: 0; transform: translateY(0); }
            20% { opacity: 0.5; }
            80% { opacity: 0.2; }
            100% { opacity: 0; transform: translateY(-200px) translateX(var(--drift)); }
        }

        .hero-particle {
            animation: particleFloat var(--duration) linear infinite;
            animation-delay: var(--delay);
        }

        /* ===== Skill Bar Fill ===== */
        .skill-progress {
            transition: width 1.3s cubic-bezier(0.16,1,0.3,1);
        }

        /* ===== Stagger Children ===== */
        .stagger-children > * {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1),
                        transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .stagger-children.stagger-visible > * {
            opacity: 1;
            transform: translateY(0);
        }

        /* ===== Preloader Exit ===== */
        #preloader.preloader-exit {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.6s ease, visibility 0.6s ease;
        }

        /* ===== Desig Line Animate ===== */
        .desig-line {
            transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
        }

        .desig-line-hidden {
            width: 0 !important;
        }

        /* ===== Scale Pop ===== */
        .scale-pop {
            opacity: 0;
            transform: scale(0);
            transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1),
                        transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        .scale-pop.pop-visible {
            opacity: 1;
            transform: scale(1);
        }

        /* ===== Card Hover Tilt (Desktop) ===== */
        @media (hover: hover) and (pointer: fine) {
            .service-card {
                transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                            border-color 0.4s, box-shadow 0.4s;
            }
        }
    `;
    document.head.appendChild(animCSS);

    /* ----------------------------------------------------------
       1. PRELOADER
    ---------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    let loadProgress = 0;

    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 18 + 4;
        if (loadProgress > 100) loadProgress = 100;
        if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
        if (loadProgress >= 100) clearInterval(loadInterval);
    }, 100);

    function hidePreloader(callback) {
        if (preloaderBar) preloaderBar.style.width = '100%';

        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('preloader-exit');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    if (callback) callback();
                }, 600);
            } else {
                if (callback) callback();
            }
        }, 600);
    }

    window.addEventListener('load', () => hidePreloader(initEverything));

    // Safety: Force hide after 5s
    setTimeout(() => {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            initEverything();
        }
    }, 5000);

    /* ----------------------------------------------------------
       2. MASTER INIT
    ---------------------------------------------------------- */
    let initialized = false;

    function initEverything() {
        if (initialized) return;
        initialized = true;

        initHeroAnimation();
        initScrollReveal();
        initNavigation();
        initCustomCursor();
        initVCardFlip();
        initContactForm();
        initParticles();
        initFloatingCards();
        initHeroParallax();
    }

    /* ----------------------------------------------------------
       3. HERO ENTRANCE ANIMATION
    ---------------------------------------------------------- */
    function initHeroAnimation() {
        const timeline = [];
        let delay = 100;

        function addStep(fn, d) {
            timeline.push({ fn, delay: d });
        }

        // --- Badge ---
        const badge = document.querySelector('.availability-badge');
        if (badge) {
            badge.classList.add('reveal-hidden');
            addStep(() => badge.classList.add('reveal-visible'), delay);
            delay += 200;
        }

        // --- Hero name: split into chars ---
        const heroWords = document.querySelectorAll('[data-hero-text]');
        const allCharGroups = [];

        heroWords.forEach((word) => {
            const text = word.textContent;
            word.textContent = '';
            const chars = [];

            text.split('').forEach((ch) => {
                const span = document.createElement('span');
                span.className = 'hero-char';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                word.appendChild(span);
                chars.push(span);
            });

            allCharGroups.push(chars);
        });

        // Animate chars
        allCharGroups.forEach((chars) => {
            chars.forEach((char, i) => {
                addStep(() => char.classList.add('char-visible'), delay + i * 35);
            });
            delay += chars.length * 35 + 100;
        });

        // --- Designation row ---
        const desigRow = document.querySelector('.hero-designation');
        const desigLines = document.querySelectorAll('.desig-line');
        if (desigRow) {
            desigRow.classList.add('reveal-hidden');
            desigLines.forEach(l => l.classList.add('desig-line-hidden'));
            addStep(() => {
                desigRow.classList.add('reveal-visible');
                desigLines.forEach(l => l.classList.remove('desig-line-hidden'));
            }, delay);
            delay += 250;
        }

        // --- Description ---
        const desc = document.querySelector('.hero-description');
        if (desc) {
            desc.classList.add('reveal-hidden');
            addStep(() => desc.classList.add('reveal-visible'), delay);
            delay += 200;
        }

        // --- CTA Buttons ---
        const ctaGroup = document.querySelector('.hero-cta-group');
        if (ctaGroup) {
            ctaGroup.classList.add('reveal-hidden');
            addStep(() => ctaGroup.classList.add('reveal-visible'), delay);
            delay += 200;
        }

        // --- Hero visual (image + cards) ---
        const heroRight = document.querySelector('.hero-right');
        if (heroRight) {
            heroRight.classList.add('reveal-hidden', 'from-right');
            addStep(() => heroRight.classList.add('reveal-visible'), delay);
            delay += 150;
        }

        // --- Float cards ---
        const floatCards = document.querySelectorAll('.info-float-card');
        floatCards.forEach((card, i) => {
            card.classList.add('scale-pop');
            addStep(() => card.classList.add('pop-visible'), delay + i * 120);
        });
        delay += floatCards.length * 120 + 100;

        // --- Stats strip ---
        const statsStrip = document.querySelector('.hero-stats-strip');
        if (statsStrip) {
            statsStrip.classList.add('reveal-hidden');
            addStep(() => {
                statsStrip.classList.add('reveal-visible');
                initCounters(); // start counters when stats appear
            }, delay);
            delay += 200;
        }

        // --- Scroll indicator ---
        const scrollInd = document.querySelector('.scroll-indicator');
        if (scrollInd) {
            scrollInd.classList.add('reveal-hidden');
            addStep(() => scrollInd.classList.add('reveal-visible'), delay);
        }

        // Execute timeline
        timeline.forEach((step) => {
            setTimeout(step.fn, step.delay);
        });
    }

    /* ----------------------------------------------------------
       4. SCROLL REVEAL (Intersection Observer)
    ---------------------------------------------------------- */
    function initScrollReveal() {
        // Observer config
        const observerOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const animType = el.dataset.revealType || 'default';

                    // Add visible class
                    el.classList.add('reveal-visible');

                    // Stagger children if needed
                    if (el.classList.contains('stagger-children')) {
                        el.classList.add('stagger-visible');
                        const kids = el.children;
                        Array.from(kids).forEach((kid, i) => {
                            kid.style.transitionDelay = (i * 80) + 'ms';
                        });
                    }

                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        // --- ABOUT ---
        setupReveal('.about-image-side', 'from-left', observer);
        setupReveal('.about-experience-tag', 'scale-pop-trigger', observer);
        setupRevealAll('.about-content-side [data-animate="scroll"]', 'default', observer);
        setupStagger('.about-details-grid', observer);

        // --- SERVICES ---
        setupReveal('.services-section .section-header', 'default', observer);
        setupRevealAll('.service-card', 'default', observer, true);

        // --- EXPERTISE ---
        setupReveal('.expertise-section .section-header', 'default', observer);
        setupRevealAll('.skill-row', 'from-left-small', observer, true);
        setupReveal('.tools-heading', 'default', observer);
        setupRevealAll('.tool-card', 'scale-small', observer, true);

        // Skill bars - separate observer
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initSkillBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const expertiseBars = document.querySelector('.expertise-bars');
        if (expertiseBars) skillsObserver.observe(expertiseBars);

        // --- VCARD ---
        setupReveal('.vcard-section .section-header', 'default', observer);
        setupReveal('.vcard-flipper', 'default', observer);

        // --- CONTACT ---
        setupReveal('.contact-section .section-header', 'default', observer);
        setupRevealAll('.contact-info-card', 'default', observer, true);
        setupReveal('.contact-form-card', 'default', observer);
        setupRevealAll('.social-circle', 'scale-small', observer, true);

        // --- FOOTER ---
        setupReveal('.footer-upper', 'default', observer);
    }

    function setupReveal(selector, type, observer) {
        const el = document.querySelector(selector);
        if (!el) return;

        if (type === 'from-left') {
            el.classList.add('reveal-hidden', 'from-left');
        } else if (type === 'scale-pop-trigger') {
            el.classList.add('scale-pop');
            // Use separate observer for scale-pop
            const popObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => el.classList.add('pop-visible'), 400);
                        popObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });
            popObserver.observe(el);
            return;
        } else {
            el.classList.add('reveal-hidden');
        }

        observer.observe(el);
    }

    function setupRevealAll(selector, type, observer, stagger) {
        const els = document.querySelectorAll(selector);
        els.forEach((el, i) => {
            if (type === 'from-left-small') {
                el.classList.add('reveal-hidden', 'from-left');
                el.style.transitionDelay = (i * 80) + 'ms';
            } else if (type === 'scale-small') {
                el.classList.add('reveal-hidden', 'from-scale');
                el.style.transitionDelay = (i * 50) + 'ms';
            } else {
                el.classList.add('reveal-hidden');
                if (stagger) {
                    el.style.transitionDelay = (i * 80) + 'ms';
                }
            }
            observer.observe(el);
        });
    }

    function setupStagger(selector, observer) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.classList.add('stagger-children');
        observer.observe(el);
    }

    /* ----------------------------------------------------------
       5. COUNTERS
    ---------------------------------------------------------- */
    let countersStarted = false;

    function initCounters() {
        if (countersStarted) return;
        countersStarted = true;

        const counters = document.querySelectorAll('.counter');
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 2000;
            const startTime = performance.now();

            function easeOut(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(easeOut(progress) * target);

                counter.textContent = value;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    /* ----------------------------------------------------------
       6. SKILL BARS
    ---------------------------------------------------------- */
    let skillsStarted = false;

    function initSkillBars() {
        if (skillsStarted) return;
        skillsStarted = true;

        const bars = document.querySelectorAll('.skill-progress');
        bars.forEach((bar, i) => {
            const progress = bar.getAttribute('data-progress') || 0;
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, i * 120);
        });
    }

    /* ----------------------------------------------------------
       7. FLOATING CARDS
    ---------------------------------------------------------- */
    function initFloatingCards() {
        const fc1 = document.querySelector('.ifc-1');
        const fc2 = document.querySelector('.ifc-2');
        const fc3 = document.querySelector('.ifc-3');

        if (fc1) fc1.classList.add('float-anim-1');
        if (fc2) fc2.classList.add('float-anim-2');
        if (fc3) fc3.classList.add('float-anim-3');
    }

    /* ----------------------------------------------------------
       8. PARTICLES
    ---------------------------------------------------------- */
    function initParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('hero-particle');

            const size = Math.random() * 3 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = (50 + Math.random() * 50) + '%';
            p.style.setProperty('--duration', (5 + Math.random() * 6) + 's');
            p.style.setProperty('--delay', (Math.random() * 6) + 's');
            p.style.setProperty('--drift', ((Math.random() - 0.5) * 80) + 'px');

            container.appendChild(p);
        }
    }

    /* ----------------------------------------------------------
       9. HERO PARALLAX (Desktop)
    ---------------------------------------------------------- */
    function initHeroParallax() {
        if (window.innerWidth < 900) return;
        if (!window.matchMedia('(hover: hover)').matches) return;

        const hero = document.querySelector('.hero-section');
        if (!hero) return;

        const fc1 = document.querySelector('.ifc-1');
        const fc2 = document.querySelector('.ifc-2');
        const fc3 = document.querySelector('.ifc-3');
        const ring = document.querySelector('.hero-decor-ring');

        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let rafId = null;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;

            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        });

        function updateParallax() {
            // Lerp
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;

            if (fc1) fc1.style.transform = `translate(${currentX * 15}px, ${currentY * 10}px)`;
            if (fc2) fc2.style.transform = `translate(${currentX * 20}px, ${currentY * 15}px)`;
            if (fc3) fc3.style.transform = `translate(${currentX * 10}px, ${currentY * 8}px)`;
            if (ring) ring.style.transform = `translate(${currentX * -12}px, ${currentY * -12}px) rotate(${currentX * 10}deg)`;

            // Keep animating if mouse is moving
            if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
                rafId = requestAnimationFrame(updateParallax);
            } else {
                rafId = null;
            }
        }

        hero.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
            if (!rafId) rafId = requestAnimationFrame(updateParallax);
        });
    }

    /* ----------------------------------------------------------
       10. CUSTOM CURSOR (Desktop only)
    ---------------------------------------------------------- */
    function initCustomCursor() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        if (!dot || !outline) return;

        let mouseX = -100, mouseY = -100;
        let outlineX = -100, outlineY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function followOutline() {
            outlineX += (mouseX - outlineX) * 0.13;
            outlineY += (mouseY - outlineY) * 0.13;
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(followOutline);
        }
        followOutline();

        // Expand on interactive
        const interactives = document.querySelectorAll(
            'a, button, .service-card, .tool-card, .contact-info-card, ' +
            '.social-circle, .vcard-flipper, .btn-back-top, .menu-toggle'
        );

        interactives.forEach((el) => {
            el.addEventListener('mouseenter', () => outline.classList.add('expanded'));
            el.addEventListener('mouseleave', () => outline.classList.remove('expanded'));
        });
    }

    /* ----------------------------------------------------------
       11. NAVIGATION
    ---------------------------------------------------------- */
    function initNavigation() {
        const header = document.getElementById('mainHeader');
        const backToTop = document.getElementById('btnBackTop');
        const menuToggle = document.getElementById('menuToggle');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const navItems = document.querySelectorAll('.nav-item');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        let scrollTicking = false;
        let currentActive = 'hero';

        // --- Scroll Handler ---
        function onScroll() {
            const y = window.scrollY;

            // Header bg — dead zone
            if (y > 80) {
                if (!header.classList.contains('header-scrolled')) {
                    header.classList.add('header-scrolled');
                }
            } else if (y < 30) {
                header.classList.remove('header-scrolled');
            }

            // Back to top
            if (y > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Active section
            const sections = document.querySelectorAll('section[id]');
            let newActive = currentActive;

            for (let i = sections.length - 1; i >= 0; i--) {
                if (y >= sections[i].offsetTop - 160) {
                    newActive = sections[i].id;
                    break;
                }
            }

            if (newActive !== currentActive) {
                currentActive = newActive;
                navItems.forEach((item) => {
                    const sec = item.getAttribute('data-section');
                    item.classList.toggle('active', sec === currentActive);
                });
            }
        }

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    onScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        // --- Back to top ---
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // --- Mobile Menu ---
        function closeMobileMenu() {
            menuToggle.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileOverlay.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        // --- Smooth Scroll ---
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetSelector = this.getAttribute('href');
                const target = document.querySelector(targetSelector);

                if (target) {
                    const headerH = header ? header.offsetHeight : 75;
                    window.scrollTo({
                        top: target.offsetTop - headerH,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu
                if (menuToggle.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
        });
    }

    /* ----------------------------------------------------------
       12. VISITING CARD FLIP
    ---------------------------------------------------------- */
    function initVCardFlip() {
        const flipper = document.getElementById('vcardFlipper');
        if (!flipper) return;

        flipper.addEventListener('click', () => {
            flipper.classList.toggle('flipped');
        });
    }

    /* ----------------------------------------------------------
       13. CONTACT FORM → WHATSAPP
    ---------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('cfName').value.trim();
            const phone = document.getElementById('cfPhone').value.trim();
            const subject = document.getElementById('cfSubject').value.trim();
            const message = document.getElementById('cfMessage').value.trim();

            if (!name || !phone || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            const text = encodeURIComponent(
                'Hello Abhinoor!\n\n' +
                '*Name:* ' + name + '\n' +
                '*Phone:* ' + phone + '\n' +
                '*Subject:* ' + subject + '\n' +
                '*Message:* ' + message
            );

            window.open('https://wa.me/918054186763?text=' + text, '_blank');
            form.reset();
        });
    }

})();
