/* =============================================================
   ABHINOOR SINGH — FINANCIAL ANALYST
   script.js — GSAP Animations + All Functionality
   
   RULE: Nothing is hidden by CSS.
   GSAP sets initial hidden state → animates to visible.
   If GSAP fails → everything stays visible (CSS default).
   ============================================================= */

(function () {
    'use strict';

    /* ==========================================
       1. PRELOADER
    ========================================== */
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    let loadProgress = 0;

    // Animate progress bar
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15 + 5;
        if (loadProgress > 100) loadProgress = 100;
        if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
        if (loadProgress >= 100) clearInterval(loadInterval);
    }, 120);

    window.addEventListener('load', () => {
        // Ensure bar reaches 100%
        if (preloaderBar) preloaderBar.style.width = '100%';

        setTimeout(() => {
            if (preloader) {
                preloader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                preloader.classList.add('preloader-done');

                setTimeout(() => {
                    preloader.style.display = 'none';
                    startAnimations();
                }, 600);
            } else {
                startAnimations();
            }
        }, 800);
    });

    // Fallback: If page takes too long, hide preloader anyway
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('preloader-done')) {
            preloader.style.display = 'none';
            preloader.classList.add('preloader-done');
            startAnimations();
        }
    }, 6000);

    /* ==========================================
       2. MAIN ANIMATION CONTROLLER
    ========================================== */
    let animationsStarted = false;

    function startAnimations() {
        if (animationsStarted) return;
        animationsStarted = true;

        // Check if GSAP loaded
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded — site works without animations');
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.config({ force3D: true, nullTargetWarn: false });

        initHeroAnimations();
        initScrollAnimations();
        initCounters();
        initSkillBars();
        initFloatingCards();
        initParticles();
        initParallax();
    }

    /* ==========================================
       3. HERO ENTRANCE ANIMATIONS
    ========================================== */
    function initHeroAnimations() {
        const heroElements = document.querySelectorAll('[data-animate="hero"]');
        if (!heroElements.length) return;

        // Create master timeline
        const masterTL = gsap.timeline({
            defaults: { ease: 'power4.out' },
            delay: 0.2
        });

        // Availability badge
        const badge = document.querySelector('.availability-badge');
        if (badge) {
            gsap.set(badge, { opacity: 0, y: 25 });
            masterTL.to(badge, { opacity: 1, y: 0, duration: 0.6 });
        }

        // Hero name — split each word into characters
        const heroWords = document.querySelectorAll('[data-hero-text]');
        heroWords.forEach((word) => {
            const text = word.textContent;
            word.textContent = '';
            const chars = [];

            text.split('').forEach((ch) => {
                const span = document.createElement('span');
                span.style.display = 'inline-block';
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                word.appendChild(span);
                chars.push(span);
            });

            gsap.set(chars, { yPercent: 110, opacity: 0 });

            masterTL.to(chars, {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.03
            }, '-=0.3');
        });

        // Designation row
        const desigRow = document.querySelector('.hero-designation');
        if (desigRow) {
            gsap.set(desigRow, { opacity: 0, y: 20 });
            gsap.set('.desig-line', { width: 0 });

            masterTL
                .to(desigRow, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
                .to('.desig-line', { width: 35, duration: 0.5 }, '-=0.3');
        }

        // Description
        const desc = document.querySelector('.hero-description');
        if (desc) {
            gsap.set(desc, { opacity: 0, y: 20 });
            masterTL.to(desc, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
        }

        // CTA buttons
        const ctaGroup = document.querySelector('.hero-cta-group');
        if (ctaGroup) {
            gsap.set(ctaGroup, { opacity: 0, y: 20 });
            masterTL.to(ctaGroup, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
        }

        // Hero visual (image side)
        const heroVisual = document.querySelector('.hero-right');
        if (heroVisual) {
            gsap.set(heroVisual, { opacity: 0, x: 60, scale: 0.95 });
            masterTL.to(heroVisual, {
                opacity: 1, x: 0, scale: 1,
                duration: 0.8, ease: 'power3.out'
            }, '-=0.4');
        }

        // Float cards
        const floatCards = document.querySelectorAll('.info-float-card');
        if (floatCards.length) {
            gsap.set(floatCards, { opacity: 0, scale: 0.6, y: 20 });
            masterTL.to(floatCards, {
                opacity: 1, scale: 1, y: 0,
                duration: 0.5, stagger: 0.12,
                ease: 'back.out(1.7)'
            }, '-=0.3');
        }

        // Stats strip
        const statsStrip = document.querySelector('.hero-stats-strip');
        if (statsStrip) {
            gsap.set(statsStrip, { opacity: 0, y: 30 });
            masterTL.to(statsStrip, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
        }

        // Scroll indicator
        const scrollInd = document.querySelector('.scroll-indicator');
        if (scrollInd) {
            gsap.set(scrollInd, { opacity: 0 });
            masterTL.to(scrollInd, { opacity: 1, duration: 0.4 }, '-=0.1');
        }
    }

    /* ==========================================
       4. SCROLL TRIGGERED ANIMATIONS
    ========================================== */
    function initScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;

        // --- ABOUT SECTION ---
        const aboutVisual = document.querySelector('.about-image-side');
        if (aboutVisual) {
            gsap.from(aboutVisual, {
                scrollTrigger: { trigger: '.about-section', start: 'top 75%', once: true },
                x: -70, opacity: 0, duration: 0.9, ease: 'power3.out'
            });
        }

        const aboutExpTag = document.querySelector('.about-experience-tag');
        if (aboutExpTag) {
            gsap.from(aboutExpTag, {
                scrollTrigger: { trigger: '.about-section', start: 'top 65%', once: true },
                scale: 0, opacity: 0, duration: 0.6,
                ease: 'back.out(1.7)', delay: 0.4
            });
        }

        // About content items
        const aboutScrollItems = document.querySelectorAll('.about-content-side [data-animate="scroll"]');
        aboutScrollItems.forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                y: 35, opacity: 0, duration: 0.6,
                delay: i * 0.1, ease: 'power3.out'
            });
        });

        const aboutDetails = document.querySelectorAll('.about-detail');
        if (aboutDetails.length) {
            gsap.from(aboutDetails, {
                scrollTrigger: { trigger: '.about-details-grid', start: 'top 85%', once: true },
                y: 25, opacity: 0, duration: 0.5,
                stagger: 0.08, ease: 'power3.out'
            });
        }

        // --- SERVICES SECTION ---
        const servicesHeader = document.querySelector('.services-section .section-header');
        if (servicesHeader) {
            gsap.from(servicesHeader, {
                scrollTrigger: { trigger: '.services-section', start: 'top 78%', once: true },
                y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        }

        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length) {
            gsap.from(serviceCards, {
                scrollTrigger: { trigger: '.services-grid', start: 'top 80%', once: true },
                y: 60, opacity: 0, duration: 0.6,
                stagger: { each: 0.08, from: 'start' },
                ease: 'power3.out'
            });
        }

        // --- EXPERTISE SECTION ---
        const expertiseHeader = document.querySelector('.expertise-section .section-header');
        if (expertiseHeader) {
            gsap.from(expertiseHeader, {
                scrollTrigger: { trigger: '.expertise-section', start: 'top 78%', once: true },
                y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        }

        const skillRows = document.querySelectorAll('.skill-row');
        if (skillRows.length) {
            gsap.from(skillRows, {
                scrollTrigger: { trigger: '.expertise-bars', start: 'top 80%', once: true },
                x: -40, opacity: 0, duration: 0.5,
                stagger: 0.08, ease: 'power3.out'
            });
        }

        const toolsHeading = document.querySelector('.tools-heading');
        if (toolsHeading) {
            gsap.from(toolsHeading, {
                scrollTrigger: { trigger: '.expertise-tools', start: 'top 85%', once: true },
                y: 30, opacity: 0, duration: 0.5, ease: 'power3.out'
            });
        }

        const toolCards = document.querySelectorAll('.tool-card');
        if (toolCards.length) {
            gsap.from(toolCards, {
                scrollTrigger: { trigger: '.tools-grid', start: 'top 85%', once: true },
                y: 30, opacity: 0, scale: 0.85,
                duration: 0.4, stagger: 0.05,
                ease: 'back.out(1.4)'
            });
        }

        // --- VCARD SECTION ---
        const vcardHeader = document.querySelector('.vcard-section .section-header');
        if (vcardHeader) {
            gsap.from(vcardHeader, {
                scrollTrigger: { trigger: '.vcard-section', start: 'top 78%', once: true },
                y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        }

        const vcardFlipper = document.querySelector('.vcard-flipper');
        if (vcardFlipper) {
            gsap.from(vcardFlipper, {
                scrollTrigger: { trigger: '.vcard-display', start: 'top 80%', once: true },
                y: 50, opacity: 0, rotateX: 12,
                duration: 0.8, ease: 'power3.out'
            });
        }

        // --- CONTACT SECTION ---
        const contactHeader = document.querySelector('.contact-section .section-header');
        if (contactHeader) {
            gsap.from(contactHeader, {
                scrollTrigger: { trigger: '.contact-section', start: 'top 78%', once: true },
                y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        }

        const contactCards = document.querySelectorAll('.contact-info-card');
        if (contactCards.length) {
            gsap.from(contactCards, {
                scrollTrigger: { trigger: '.contact-cards-row', start: 'top 85%', once: true },
                y: 45, opacity: 0, duration: 0.5,
                stagger: 0.1, ease: 'power3.out'
            });
        }

        const formCard = document.querySelector('.contact-form-card');
        if (formCard) {
            gsap.from(formCard, {
                scrollTrigger: { trigger: '.contact-form-wrapper', start: 'top 85%', once: true },
                y: 45, opacity: 0, duration: 0.7, ease: 'power3.out'
            });
        }

        const socialCircles = document.querySelectorAll('.social-circle');
        if (socialCircles.length) {
            gsap.from(socialCircles, {
                scrollTrigger: { trigger: '.contact-social', start: 'top 90%', once: true },
                y: 20, opacity: 0, scale: 0.5,
                duration: 0.4, stagger: 0.06,
                ease: 'back.out(1.7)'
            });
        }

        // --- FOOTER ---
        const footerUpper = document.querySelector('.footer-upper');
        if (footerUpper) {
            gsap.from(footerUpper, {
                scrollTrigger: { trigger: '.main-footer', start: 'top 92%', once: true },
                y: 25, opacity: 0, duration: 0.5, ease: 'power3.out'
            });
        }
    }

    /* ==========================================
       5. COUNTER ANIMATION
    ========================================== */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        if (typeof ScrollTrigger !== 'undefined') {
            const statsStrip = document.querySelector('.hero-stats-strip');
            if (statsStrip) {
                ScrollTrigger.create({
                    trigger: statsStrip,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => animateCounters(counters)
                });
            }
        } else {
            // Fallback: animate after 2 seconds
            setTimeout(() => animateCounters(counters), 2000);
        }
    }

    function animateCounters(counters) {
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            gsap.to(counter, {
                textContent: target,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function () {
                    counter.textContent = Math.round(parseFloat(counter.textContent));
                }
            });
        });
    }

    /* ==========================================
       6. SKILL BARS
    ========================================== */
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        if (!skillBars.length) return;

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: '.expertise-bars',
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    skillBars.forEach((bar, i) => {
                        const progress = bar.getAttribute('data-progress') || 0;
                        gsap.to(bar, {
                            width: progress + '%',
                            duration: 1.2,
                            delay: i * 0.12,
                            ease: 'power3.out'
                        });
                    });
                }
            });
        } else {
            // Fallback
            setTimeout(() => {
                skillBars.forEach((bar) => {
                    bar.style.width = (bar.getAttribute('data-progress') || 0) + '%';
                    bar.style.transition = 'width 1.2s ease';
                });
            }, 1000);
        }
    }

    /* ==========================================
       7. FLOATING CARD BOBBING
    ========================================== */
    function initFloatingCards() {
        if (typeof gsap === 'undefined') return;

        gsap.to('.ifc-1', {
            y: -14, duration: 3, yoyo: true,
            repeat: -1, ease: 'sine.inOut', delay: 1
        });

        gsap.to('.ifc-2', {
            y: -11, duration: 3.5, yoyo: true,
            repeat: -1, ease: 'sine.inOut', delay: 1.5
        });

        gsap.to('.ifc-3', {
            y: -9, duration: 2.8, yoyo: true,
            repeat: -1, ease: 'sine.inOut', delay: 2
        });
    }

    /* ==========================================
       8. PARTICLES
    ========================================== */
    function initParticles() {
        if (typeof gsap === 'undefined') return;

        const container = document.getElementById('particlesContainer');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = '0';
            container.appendChild(particle);

            // Animate each particle
            gsap.to(particle, {
                opacity: Math.random() * 0.4 + 0.1,
                y: -(80 + Math.random() * 150),
                x: (Math.random() - 0.5) * 80,
                duration: 5 + Math.random() * 5,
                repeat: -1,
                delay: Math.random() * 5,
                ease: 'none'
            });
        }
    }

    /* ==========================================
       9. HERO PARALLAX (Desktop Only)
    ========================================== */
    function initParallax() {
        if (typeof gsap === 'undefined' || window.innerWidth < 900) return;

        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to('.ifc-1', { x: x * 15, duration: 0.6, overwrite: 'auto' });
            gsap.to('.ifc-2', { x: x * 20, duration: 0.6, overwrite: 'auto' });
            gsap.to('.ifc-3', { x: x * 10, duration: 0.6, overwrite: 'auto' });
            gsap.to('.hero-decor-ring', { x: x * -12, y: y * -12, duration: 0.8, overwrite: 'auto' });
        });
    }

    /* ==========================================
       10. CUSTOM CURSOR (Desktop Only)
    ========================================== */
    (function initCursor() {
        // Only for devices with hover + fine pointer
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

        // Smooth outline follow
        function followCursor() {
            outlineX += (mouseX - outlineX) * 0.14;
            outlineY += (mouseY - outlineY) * 0.14;
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(followCursor);
        }
        followCursor();

        // Expand on interactive elements
        const interactiveEls = document.querySelectorAll(
            'a, button, .service-card, .tool-card, .contact-info-card, .social-circle, .vcard-flipper, .btn-back-top, .menu-toggle'
        );

        interactiveEls.forEach((el) => {
            el.addEventListener('mouseenter', () => outline.classList.add('expanded'));
            el.addEventListener('mouseleave', () => outline.classList.remove('expanded'));
        });
    })();

    /* ==========================================
       11. NAVIGATION
    ========================================== */
    (function initNavigation() {
        const header = document.getElementById('mainHeader');
        const backToTop = document.getElementById('btnBackTop');
        const menuToggle = document.getElementById('menuToggle');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const allNavItems = document.querySelectorAll('.nav-item');
        const allMobileLinks = document.querySelectorAll('.mobile-link');

        // --- Scroll handler (throttled) ---
        let scrollTicking = false;
        let currentActiveSection = 'hero';

        function handleScroll() {
            const y = window.scrollY;

            // Header background — dead zone prevents glitch
            if (y > 80) {
                header.classList.add('header-scrolled');
            } else if (y < 30) {
                header.classList.remove('header-scrolled');
            }

            // Back to top
            if (y > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Active nav link
            const sections = document.querySelectorAll('section[id]');
            let newActive = currentActiveSection;

            for (let i = sections.length - 1; i >= 0; i--) {
                const sec = sections[i];
                if (y >= sec.offsetTop - 160) {
                    newActive = sec.id;
                    break;
                }
            }

            if (newActive !== currentActiveSection) {
                currentActiveSection = newActive;
                allNavItems.forEach((item) => {
                    const section = item.getAttribute('data-section');
                    item.classList.toggle('active', section === currentActiveSection);
                });
            }
        }

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        // --- Back to top ---
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // --- Mobile menu ---
        if (menuToggle && mobileOverlay) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('open');
                mobileOverlay.classList.toggle('open');
                document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
            });

            // Close on link click
            allMobileLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('open');
                    mobileOverlay.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }

        // --- Smooth scroll for all anchor links ---
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 75;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                if (menuToggle && menuToggle.classList.contains('open')) {
                    menuToggle.classList.remove('open');
                    mobileOverlay.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    })();

    /* ==========================================
       12. VISITING CARD FLIP
    ========================================== */
    (function initVCardFlip() {
        const flipper = document.getElementById('vcardFlipper');
        if (!flipper) return;

        flipper.addEventListener('click', () => {
            flipper.classList.toggle('flipped');
        });
    })();

    /* ==========================================
       13. CONTACT FORM → WHATSAPP
    ========================================== */
    (function initContactForm() {
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

            const whatsappText = encodeURIComponent(
                'Hello Abhinoor!\n\n' +
                '*Name:* ' + name + '\n' +
                '*Phone:* ' + phone + '\n' +
                '*Subject:* ' + subject + '\n' +
                '*Message:* ' + message
            );

            const whatsappURL = 'https://wa.me/918054186763?text=' + whatsappText;
            window.open(whatsappURL, '_blank');
            form.reset();
        });
    })();

})();
