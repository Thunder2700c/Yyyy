(function () {
    'use strict';

    // ==================== SAFETY: If GSAP fails, show everything ====================
    const safetyTimer = setTimeout(() => {
        document.querySelectorAll('.gsap-hero, .gsap-fc, .gsap-reveal').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 5000);

    // ==================== WAIT FOR GSAP ====================
    function waitForGSAP(cb) {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            cb();
        } else {
            setTimeout(() => waitForGSAP(cb), 50);
        }
    }

    waitForGSAP(function () {
        clearTimeout(safetyTimer);
        gsap.registerPlugin(ScrollTrigger);
        gsap.config({ force3D: true, nullTargetWarn: false });

        // ==================== SPLIT TEXT ====================
        function splitText(el) {
            const text = el.textContent;
            el.textContent = '';
            const chars = [];
            text.split('').forEach(ch => {
                const span = document.createElement('span');
                span.classList.add('char');
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                el.appendChild(span);
                chars.push(span);
            });
            return chars;
        }

        const heroLines = document.querySelectorAll('[data-split]');
        const splitChars = [];
        heroLines.forEach(line => {
            const chars = splitText(line);
            splitChars.push(chars);
        });

        // ==================== SET INITIAL STATES (GSAP only — not CSS) ====================
        // Hero elements
        gsap.set('.gsap-hero', { opacity: 0, y: 30 });
        gsap.set('.gsap-fc', { opacity: 0, scale: 0.5 });
        gsap.set('.hero-visual', { opacity: 0, x: 50 });

        // Chars
        splitChars.forEach(chars => {
            gsap.set(chars, { yPercent: 100, opacity: 0 });
        });

        // Title lines
        gsap.set('.t-line', { width: 0 });

        // Scroll reveal elements — DON'T hide yet, will be done per-element on observe
        // This prevents "flash of invisible content" if scroll is already past

        // ==================== LOADER ====================
        const loaderTL = gsap.timeline({
            onComplete: () => {
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('hidden');
                    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 600);
                }
                runHeroAnimation();
            }
        });

        loaderTL
            .to('.loader-logo', { scale: 1.1, duration: .4, yoyo: true, repeat: 1, ease: 'power2.inOut' })
            .from('.loader-name span', {
                yPercent: 120, opacity: 0,
                duration: .4, stagger: .04,
                ease: 'power4.out'
            }, '-=.3')
            .to('#loaderFill', { width: '100%', duration: 1, ease: 'power2.inOut' }, '-=.2')
            .to('.loader-inner', { opacity: 0, y: -30, duration: .4 }, '+=.2');

        // ==================== HERO ANIMATION ====================
        function runHeroAnimation() {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            tl
                // Badge
                .to('.hero-badge', { opacity: 1, y: 0, duration: .5 })

                // Name line 1 chars
                .to(splitChars[0] || [], {
                    yPercent: 0, opacity: 1,
                    duration: .7,
                    stagger: { each: .03, from: 'start' }
                }, '-=.2')

                // Name line 2 chars
                .to(splitChars[1] || [], {
                    yPercent: 0, opacity: 1,
                    duration: .7,
                    stagger: { each: .03, from: 'start' }
                }, '-=.4')

                // Title row
                .to('.hero-title-row', { opacity: 1, y: 0, duration: .5 }, '-=.3')
                .to('.t-line-l', { width: 40, duration: .5 }, '-=.3')
                .to('.t-line-r', { width: 40, duration: .5 }, '-=.5')

                // Description
                .to('.hero-desc', { opacity: 1, y: 0, duration: .5 }, '-=.2')

                // Buttons
                .to('.hero-btns', { opacity: 1, y: 0, duration: .5 }, '-=.2')

                // Visual (photo side)
                .to('.hero-visual', { opacity: 1, x: 0, duration: .7, ease: 'power3.out' }, '-=.4')

                // Float cards
                .to('.gsap-fc', {
                    opacity: 1, scale: 1,
                    duration: .5, stagger: .12,
                    ease: 'back.out(1.7)'
                }, '-=.3')

                // Stats bar
                .to('.hero-stats', { opacity: 1, y: 0, duration: .5 }, '-=.2')

                // Scroll indicator
                .to('.scroll-down', { opacity: 1, y: 0, duration: .4 }, '-=.1');

            // Counters
            document.querySelectorAll('.h-stat-num').forEach(el => {
                const target = parseInt(el.dataset.target) || 0;
                gsap.to(el, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    delay: 1.5
                });
            });
        }

        // ==================== FLOAT CARD BOBBING ====================
        gsap.to('.fc-1', { y: -15, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 3 });
        gsap.to('.fc-2', { y: -12, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 3.5 });
        gsap.to('.fc-3', { y: -10, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 4 });

        // ==================== SCROLL TRIGGERED SECTIONS ====================

        // About
        gsap.from('.about-visual', {
            scrollTrigger: { trigger: '.about', start: 'top 75%' },
            x: -60, opacity: 0, duration: .8, ease: 'power3.out'
        });

        gsap.from('.about-content .gsap-reveal', {
            scrollTrigger: { trigger: '.about-content', start: 'top 75%' },
            y: 40, opacity: 0, duration: .6,
            stagger: .12, ease: 'power3.out'
        });

        gsap.from('.info-item', {
            scrollTrigger: { trigger: '.about-info', start: 'top 80%' },
            y: 20, opacity: 0, duration: .4,
            stagger: .08, ease: 'power3.out'
        });

        gsap.from('.about-badge', {
            scrollTrigger: { trigger: '.about-visual', start: 'top 65%' },
            scale: 0, opacity: 0, duration: .5,
            ease: 'back.out(1.7)', delay: .3
        });

        // Services
        gsap.from('.services .sec-header', {
            scrollTrigger: { trigger: '.services', start: 'top 75%' },
            y: 40, opacity: 0, duration: .6, ease: 'power3.out'
        });

        gsap.from('.srv-card', {
            scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
            y: 50, opacity: 0, duration: .6,
            stagger: { each: .08, from: 'start' },
            ease: 'power3.out'
        });

        // Skills
        gsap.from('.skills .sec-header', {
            scrollTrigger: { trigger: '.skills', start: 'top 75%' },
            y: 40, opacity: 0, duration: .6, ease: 'power3.out'
        });

        gsap.from('.sk-item', {
            scrollTrigger: { trigger: '.skills-bars', start: 'top 80%' },
            x: -30, opacity: 0, duration: .5,
            stagger: .08, ease: 'power3.out'
        });

        // Skill bar fills
        document.querySelectorAll('.sk-fill').forEach(bar => {
            gsap.to(bar, {
                width: bar.dataset.w + '%',
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: bar, start: 'top 90%' }
            });
        });

        gsap.from('.skills-tools', {
            scrollTrigger: { trigger: '.skills-tools', start: 'top 80%' },
            y: 40, opacity: 0, duration: .6, ease: 'power3.out'
        });

        gsap.from('.tool', {
            scrollTrigger: { trigger: '.tools-grid', start: 'top 85%' },
            y: 25, opacity: 0, scale: .8,
            duration: .4, stagger: .05,
            ease: 'back.out(1.4)'
        });

        // VCard
        gsap.from('.vcard-section .sec-header', {
            scrollTrigger: { trigger: '.vcard-section', start: 'top 75%' },
            y: 40, opacity: 0, duration: .6, ease: 'power3.out'
        });

        gsap.from('.vcard-3d', {
            scrollTrigger: { trigger: '.vcard-wrap', start: 'top 80%' },
            y: 50, opacity: 0, rotateX: 10,
            duration: .7, ease: 'power3.out'
        });

        // Contact
        gsap.from('.contact .sec-header', {
            scrollTrigger: { trigger: '.contact', start: 'top 75%' },
            y: 40, opacity: 0, duration: .6, ease: 'power3.out'
        });

        gsap.from('.cc-card', {
            scrollTrigger: { trigger: '.contact-cards', start: 'top 85%' },
            y: 40, opacity: 0, duration: .5,
            stagger: .1, ease: 'power3.out'
        });

        gsap.from('.contact-form-box', {
            scrollTrigger: { trigger: '.contact-form-box', start: 'top 85%' },
            y: 40, opacity: 0, duration: .6, ease: 'power3.out'
        });

        gsap.from('.soc-btn', {
            scrollTrigger: { trigger: '.social-area', start: 'top 90%' },
            y: 15, opacity: 0, scale: .5,
            duration: .3, stagger: .06,
            ease: 'back.out(1.7)'
        });

        // Footer
        gsap.from('.footer-top', {
            scrollTrigger: { trigger: '.footer', start: 'top 90%' },
            y: 25, opacity: 0, duration: .5, ease: 'power3.out'
        });

        // ==================== NAVBAR ====================
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        const allNavLinks = document.querySelectorAll('.nav-link');

        let ticking = false;
        let currentActive = 'home';

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;

                    // Navbar — dead zone prevents glitch
                    if (y > 80) navbar.classList.add('scrolled');
                    else if (y < 30) navbar.classList.remove('scrolled');

                    // Back to top
                    if (y > 500) backToTop.classList.add('visible');
                    else backToTop.classList.remove('visible');

                    // Active link
                    const sections = document.querySelectorAll('section[id]');
                    let newActive = currentActive;
                    for (let i = sections.length - 1; i >= 0; i--) {
                        if (y >= sections[i].offsetTop - 150) {
                            newActive = sections[i].id;
                            break;
                        }
                    }
                    if (newActive !== currentActive) {
                        currentActive = newActive;
                        allNavLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === '#' + currentActive);
                        });
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Hamburger
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

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - navbar.offsetHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // ==================== VCARD FLIP ====================
        const vcard = document.getElementById('vcard3d');
        if (vcard) vcard.addEventListener('click', () => vcard.classList.toggle('flipped'));

        // ==================== FORM → WHATSAPP ====================
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const name = document.getElementById('fname').value.trim();
                const phone = document.getElementById('fphone').value.trim();
                const subject = document.getElementById('fsubject').value.trim();
                const message = document.getElementById('fmessage').value.trim();

                if (!name || !phone || !subject || !message) {
                    alert('Please fill all fields.');
                    return;
                }

                const msg = encodeURIComponent(
                    'Hello Abhinoor!\n\n' +
                    '*Name:* ' + name + '\n' +
                    '*Phone:* ' + phone + '\n' +
                    '*Subject:* ' + subject + '\n' +
                    '*Message:* ' + message
                );

                window.open('https://wa.me/918054186763?text=' + msg, '_blank');
                form.reset();
            });
        }

        // ==================== CUSTOM CURSOR (Desktop only) ====================
        if (window.innerWidth > 768) {
            const dot = document.getElementById('cursorDot');
            const ring = document.getElementById('cursorRing');

            if (dot && ring) {
                let mx = -20, my = -20, rx = -20, ry = -20;

                document.addEventListener('mousemove', e => {
                    mx = e.clientX;
                    my = e.clientY;
                    gsap.set(dot, { x: mx - 3, y: my - 3 });
                });

                gsap.ticker.add(() => {
                    rx += (mx - rx) * 0.15;
                    ry += (my - ry) * 0.15;
                    gsap.set(ring, { x: rx - 17.5, y: ry - 17.5 });
                });

                document.querySelectorAll('a, button, .srv-card, .tool, .cc-card, .soc-btn, .vcard-3d').forEach(el => {
                    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
                    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
                });
            }
        }

        // ==================== PARTICLES ====================
        const pc = document.getElementById('heroParticles');
        if (pc) {
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('div');
                p.classList.add('h-particle');
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                const size = Math.random() * 3 + 1;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                pc.appendChild(p);

                gsap.fromTo(p,
                    { opacity: 0 },
                    {
                        opacity: .4,
                        y: -(100 + Math.random() * 200),
                        duration: 4 + Math.random() * 4,
                        repeat: -1,
                        delay: Math.random() * 5,
                        ease: 'none'
                    }
                );
            }
        }

        // ==================== HERO PARALLAX (Desktop) ====================
        if (window.innerWidth > 768) {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.addEventListener('mousemove', e => {
                    const rect = hero.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;

                    gsap.to('.fc-1', { x: x * 15, y: y * 10 + 'px', duration: .5, overwrite: 'auto' });
                    gsap.to('.fc-2', { x: x * 20, y: y * 15 + 'px', duration: .5, overwrite: 'auto' });
                    gsap.to('.fc-3', { x: x * 10, y: y * 8 + 'px', duration: .5, overwrite: 'auto' });
                });
            }
        }

    }); // end waitForGSAP

})(); // end IIFE
