(function () {
    'use strict';

    /* ==========================================================
       0. INJECT ANIMATION STYLES
       Keeps all animation CSS in JS so main style.css stays clean.
       If JS doesn't load → no invisible elements.
    ========================================================== */
    var animStyles = document.createElement('style');
    animStyles.textContent = [

        /* --- Reveal: fade up --- */
        '.js-hidden {',
        '  opacity: 0;',
        '  transform: translateY(40px);',
        '  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),',
        '              transform 0.7s cubic-bezier(0.16,1,0.3,1);',
        '}',

        '.js-hidden.from-left {',
        '  transform: translateX(-60px) translateY(0);',
        '}',

        '.js-hidden.from-right {',
        '  transform: translateX(60px) translateY(0);',
        '}',

        '.js-hidden.from-scale {',
        '  transform: scale(0.7) translateY(0);',
        '}',

        '.js-visible {',
        '  opacity: 1 !important;',
        '  transform: none !important;',
        '}',

        /* --- Hero character animation --- */
        '.hero-char {',
        '  display: inline-block;',
        '  opacity: 0;',
        '  transform: translateY(110%);',
        '  transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1),',
        '              transform 0.5s cubic-bezier(0.16,1,0.3,1);',
        '}',

        '.hero-char.char-show {',
        '  opacity: 1;',
        '  transform: translateY(0);',
        '}',

        /* --- Scale pop (for badges, float cards) --- */
        '.js-scale-pop {',
        '  opacity: 0;',
        '  transform: scale(0);',
        '  transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1),',
        '              transform 0.5s cubic-bezier(0.34,1.56,0.64,1);',
        '}',

        '.js-scale-pop.pop-show {',
        '  opacity: 1;',
        '  transform: scale(1);',
        '}',

        /* --- Designation line width animation --- */
        '.desig-line-zero {',
        '  width: 0 !important;',
        '  transition: width 0.6s cubic-bezier(0.16,1,0.3,1);',
        '}',

        /* --- Float card bobbing --- */
        '@keyframes bobUp1 {',
        '  0%, 100% { transform: translateY(0); }',
        '  50% { transform: translateY(-14px); }',
        '}',

        '@keyframes bobUp2 {',
        '  0%, 100% { transform: translateY(0); }',
        '  50% { transform: translateY(-11px); }',
        '}',

        '@keyframes bobUp3 {',
        '  0%, 100% { transform: translateY(0); }',
        '  50% { transform: translateY(-9px); }',
        '}',

        '.bob-1 { animation: bobUp1 3.5s ease-in-out infinite; }',
        '.bob-2 { animation: bobUp2 4s ease-in-out infinite 0.5s; }',
        '.bob-3 { animation: bobUp3 3s ease-in-out infinite 1s; }',

        /* --- Particles --- */
        '@keyframes particleDrift {',
        '  0% { opacity: 0; transform: translateY(0) translateX(0); }',
        '  15% { opacity: var(--p-opacity, 0.4); }',
        '  85% { opacity: var(--p-opacity, 0.2); }',
        '  100% { opacity: 0; transform: translateY(var(--p-y, -180px)) translateX(var(--p-x, 20px)); }',
        '}',

        '.hero-particle {',
        '  animation: particleDrift var(--p-dur, 6s) linear infinite;',
        '  animation-delay: var(--p-delay, 0s);',
        '}',

        /* --- Skill bar transition --- */
        '.skill-progress {',
        '  transition: width 1.3s cubic-bezier(0.16,1,0.3,1);',
        '}',

        /* --- Preloader exit --- */
        '#preloader.preloader-leaving {',
        '  opacity: 0;',
        '  visibility: hidden;',
        '  transition: opacity 0.6s ease, visibility 0.6s ease;',
        '}',

        /* --- Stagger children --- */
        '.js-stagger > * {',
        '  opacity: 0;',
        '  transform: translateY(25px);',
        '  transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1),',
        '              transform 0.5s cubic-bezier(0.16,1,0.3,1);',
        '}',

        '.js-stagger.stagger-show > * {',
        '  opacity: 1;',
        '  transform: translateY(0);',
        '}'

    ].join('\n');
    document.head.appendChild(animStyles);


    /* ==========================================================
       1. PRELOADER
    ========================================================== */
    var preloader = document.getElementById('preloader');
    var preloaderBar = document.getElementById('preloaderBar');
    var loadProgress = 0;

    // Animate progress bar
    var loadTimer = setInterval(function () {
        loadProgress += Math.random() * 18 + 4;
        if (loadProgress > 100) loadProgress = 100;
        if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
        if (loadProgress >= 100) clearInterval(loadTimer);
    }, 100);

    // Hide preloader after page load
    function hidePreloader(callback) {
        if (preloaderBar) preloaderBar.style.width = '100%';

        setTimeout(function () {
            if (preloader) {
                preloader.classList.add('preloader-leaving');
                setTimeout(function () {
                    preloader.style.display = 'none';
                    preloader.classList.add('preloader-done');
                    if (callback) callback();
                }, 650);
            } else {
                if (callback) callback();
            }
        }, 500);
    }

    window.addEventListener('load', function () {
        hidePreloader(startApp);
    });

    // Safety fallback — force hide after 5 seconds
    setTimeout(function () {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            startApp();
        }
    }, 5000);


    /* ==========================================================
       2. APP STARTER
    ========================================================== */
    var appStarted = false;

    function startApp() {
        if (appStarted) return;
        appStarted = true;

        initHeroEntrance();
        initScrollReveal();
        initNavigation();
        initVCardFlip();
        initContactForm();
        initCustomCursor();
        initParticles();
        initFloatingCards();
        initHeroParallax();
    }


    /* ==========================================================
       3. HERO ENTRANCE ANIMATION
       Runs once after preloader hides.
       Uses setTimeout stagger for sequenced reveal.
    ========================================================== */
    function initHeroEntrance() {

        // Build a timeline of steps: { fn, delay }
        var steps = [];
        var delay = 100;

        // --- Helper: queue a step ---
        function queue(fn, d) {
            steps.push({ fn: fn, delay: d });
        }

        // ---- BADGE ----
        var badge = document.querySelector('.availability-badge');
        if (badge) {
            badge.classList.add('js-hidden');
            queue(function () { badge.classList.add('js-visible'); }, delay);
            delay += 200;
        }

        // ---- HERO NAME: Split into characters ----
        var heroWordEls = document.querySelectorAll('[data-hero-text]');
        var charGroups = [];

        for (var w = 0; w < heroWordEls.length; w++) {
            var wordEl = heroWordEls[w];
            var text = wordEl.textContent;
            wordEl.textContent = '';
            var chars = [];

            for (var c = 0; c < text.length; c++) {
                var span = document.createElement('span');
                span.className = 'hero-char';
                span.textContent = text[c] === ' ' ? '\u00A0' : text[c];
                wordEl.appendChild(span);
                chars.push(span);
            }

            charGroups.push(chars);
        }

        // Animate characters per group
        for (var g = 0; g < charGroups.length; g++) {
            var group = charGroups[g];
            for (var i = 0; i < group.length; i++) {
                (function (charEl, charDelay) {
                    queue(function () {
                        charEl.classList.add('char-show');
                    }, charDelay);
                })(group[i], delay + i * 35);
            }
            delay += group.length * 35 + 120;
        }

        // ---- DESIGNATION ROW ----
        var desigRow = document.querySelector('.hero-designation');
        var desigLines = document.querySelectorAll('.desig-line');

        if (desigRow) {
            desigRow.classList.add('js-hidden');
            for (var dl = 0; dl < desigLines.length; dl++) {
                desigLines[dl].classList.add('desig-line-zero');
            }

            queue(function () {
                desigRow.classList.add('js-visible');
                for (var dl2 = 0; dl2 < desigLines.length; dl2++) {
                    desigLines[dl2].classList.remove('desig-line-zero');
                }
            }, delay);
            delay += 250;
        }

        // ---- DESCRIPTION ----
        var desc = document.querySelector('.hero-description');
        if (desc) {
            desc.classList.add('js-hidden');
            queue(function () { desc.classList.add('js-visible'); }, delay);
            delay += 200;
        }

        // ---- CTA BUTTONS ----
        var ctaGroup = document.querySelector('.hero-cta-group');
        if (ctaGroup) {
            ctaGroup.classList.add('js-hidden');
            queue(function () { ctaGroup.classList.add('js-visible'); }, delay);
            delay += 200;
        }

        // ---- HERO RIGHT (Image side) ----
        var heroRight = document.querySelector('.hero-right');
        if (heroRight) {
            heroRight.classList.add('js-hidden', 'from-right');
            queue(function () { heroRight.classList.add('js-visible'); }, delay);
            delay += 200;
        }

        // ---- FLOATING INFO CARDS ----
        var floatCards = document.querySelectorAll('.info-float-card');
        for (var fc = 0; fc < floatCards.length; fc++) {
            (function (card, cardDelay) {
                card.classList.add('js-scale-pop');
                queue(function () { card.classList.add('pop-show'); }, cardDelay);
            })(floatCards[fc], delay + fc * 130);
        }
        if (floatCards.length) delay += floatCards.length * 130 + 100;

        // ---- STATS STRIP ----
        var statsStrip = document.querySelector('.hero-stats-strip');
        if (statsStrip) {
            statsStrip.classList.add('js-hidden');
            queue(function () {
                statsStrip.classList.add('js-visible');
                startCounters();
            }, delay);
            delay += 200;
        }

        // ---- SCROLL INDICATOR ----
        var scrollInd = document.querySelector('.scroll-indicator');
        if (scrollInd) {
            scrollInd.classList.add('js-hidden');
            queue(function () { scrollInd.classList.add('js-visible'); }, delay);
        }

        // ---- EXECUTE ALL STEPS ----
        for (var s = 0; s < steps.length; s++) {
            (function (step) {
                setTimeout(step.fn, step.delay);
            })(steps[s]);
        }
    }


    /* ==========================================================
       4. SCROLL REVEAL (Intersection Observer)
       Observes elements → adds .js-visible when in viewport.
    ========================================================== */
    function initScrollReveal() {

        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: just show everything
            return;
        }

        var observerConfig = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // ---- Main reveal observer ----
        var revealObserver = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var el = entries[i].target;
                    el.classList.add('js-visible');

                    // If stagger container, add stagger-show + set delays
                    if (el.classList.contains('js-stagger')) {
                        el.classList.add('stagger-show');
                        var kids = el.children;
                        for (var k = 0; k < kids.length; k++) {
                            kids[k].style.transitionDelay = (k * 80) + 'ms';
                        }
                    }

                    revealObserver.unobserve(el);
                }
            }
        }, observerConfig);

        // ---- Scale pop observer (for experience badge) ----
        var popObserver = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var el = entries[i].target;
                    setTimeout(function () {
                        el.classList.add('pop-show');
                    }, 400);
                    popObserver.unobserve(el);
                }
            }
        }, { threshold: 0.3 });

        // ---- Skill bars observer ----
        var skillObserver = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    fillSkillBars();
                    skillObserver.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.2 });


        // ==== ABOUT SECTION ====
        revealEl('.about-image-side', 'from-left', revealObserver);

        var aboutExpTag = document.querySelector('.about-experience-tag');
        if (aboutExpTag) {
            aboutExpTag.classList.add('js-scale-pop');
            popObserver.observe(aboutExpTag);
        }

        revealAll('.about-content-side [data-animate="scroll"]', 'default', revealObserver, false);
        staggerEl('.about-details-grid', revealObserver);


        // ==== SERVICES SECTION ====
        revealEl('.services-section .section-header', 'default', revealObserver);
        revealAll('.service-card', 'default', revealObserver, true);


        // ==== EXPERTISE SECTION ====
        revealEl('.expertise-section .section-header', 'default', revealObserver);
        revealAll('.skill-row', 'from-left', revealObserver, true);

        var expertiseBars = document.querySelector('.expertise-bars');
        if (expertiseBars) skillObserver.observe(expertiseBars);

        revealEl('.tools-heading', 'default', revealObserver);
        revealAll('.tool-card', 'from-scale', revealObserver, true);


        // ==== VCARD SECTION ====
        revealEl('.vcard-section .section-header', 'default', revealObserver);
        revealEl('.vcard-display', 'default', revealObserver);


        // ==== CONTACT SECTION ====
        revealEl('.contact-section .section-header', 'default', revealObserver);
        revealAll('.contact-info-card', 'default', revealObserver, true);
        revealEl('.contact-form-card', 'default', revealObserver);
        revealAll('.social-circle', 'from-scale', revealObserver, true);


        // ==== FOOTER ====
        revealEl('.footer-upper', 'default', revealObserver);
    }

    // --- Helper: Setup single element for reveal ---
    function revealEl(selector, direction, observer) {
        var el = document.querySelector(selector);
        if (!el) return;

        if (direction === 'from-left') {
            el.classList.add('js-hidden', 'from-left');
        } else if (direction === 'from-right') {
            el.classList.add('js-hidden', 'from-right');
        } else {
            el.classList.add('js-hidden');
        }

        observer.observe(el);
    }

    // --- Helper: Setup multiple elements ---
    function revealAll(selector, direction, observer, stagger) {
        var els = document.querySelectorAll(selector);
        for (var i = 0; i < els.length; i++) {
            if (direction === 'from-left') {
                els[i].classList.add('js-hidden', 'from-left');
            } else if (direction === 'from-scale') {
                els[i].classList.add('js-hidden', 'from-scale');
            } else {
                els[i].classList.add('js-hidden');
            }

            if (stagger) {
                els[i].style.transitionDelay = (i * 80) + 'ms';
            }

            observer.observe(els[i]);
        }
    }

    // --- Helper: Setup stagger container ---
    function staggerEl(selector, observer) {
        var el = document.querySelector(selector);
        if (!el) return;
        el.classList.add('js-stagger');
        observer.observe(el);
    }


    /* ==========================================================
       5. COUNTERS (Hero stats)
    ========================================================== */
    var countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        var counters = document.querySelectorAll('.counter');

        for (var i = 0; i < counters.length; i++) {
            (function (counter) {
                var target = parseInt(counter.getAttribute('data-count'), 10) || 0;
                var duration = 2000;
                var startTime = null;

                function easeOutCubic(t) {
                    return 1 - Math.pow(1 - t, 3);
                }

                function tick(now) {
                    if (!startTime) startTime = now;
                    var elapsed = now - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var value = Math.floor(easeOutCubic(progress) * target);

                    counter.textContent = value;

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(tick);
            })(counters[i]);
        }
    }


    /* ==========================================================
       6. SKILL BARS
    ========================================================== */
    var skillsFilled = false;

    function fillSkillBars() {
        if (skillsFilled) return;
        skillsFilled = true;

        var bars = document.querySelectorAll('.skill-progress');
        for (var i = 0; i < bars.length; i++) {
            (function (bar, index) {
                var progress = bar.getAttribute('data-progress') || '0';
                setTimeout(function () {
                    bar.style.width = progress + '%';
                }, index * 120 + 200);
            })(bars[i], i);
        }
    }


    /* ==========================================================
       7. FLOATING CARDS (CSS animation classes)
    ========================================================== */
    function initFloatingCards() {
        var fc1 = document.querySelector('.ifc-1');
        var fc2 = document.querySelector('.ifc-2');
        var fc3 = document.querySelector('.ifc-3');

        // Add bobbing animation after a delay (so entrance animation finishes first)
        setTimeout(function () {
            if (fc1) fc1.classList.add('bob-1');
            if (fc2) fc2.classList.add('bob-2');
            if (fc3) fc3.classList.add('bob-3');
        }, 3000);
    }


    /* ==========================================================
       8. PARTICLES
    ========================================================== */
    function initParticles() {
        var container = document.getElementById('particlesContainer');
        if (!container) return;

        for (var i = 0; i < 20; i++) {
            var p = document.createElement('div');
            p.classList.add('hero-particle');

            var size = Math.random() * 3 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = (40 + Math.random() * 55) + '%';
            p.style.setProperty('--p-dur', (5 + Math.random() * 6) + 's');
            p.style.setProperty('--p-delay', (Math.random() * 7) + 's');
            p.style.setProperty('--p-y', -(100 + Math.random() * 150) + 'px');
            p.style.setProperty('--p-x', ((Math.random() - 0.5) * 80) + 'px');
            p.style.setProperty('--p-opacity', (Math.random() * 0.3 + 0.15).toFixed(2));

            container.appendChild(p);
        }
    }


    /* ==========================================================
       9. HERO PARALLAX (Desktop only)
       Float cards follow mouse with smooth lerp.
    ========================================================== */
    function initHeroParallax() {
        // Only on desktop with mouse
        if (window.innerWidth < 900) return;
        if (!window.matchMedia('(hover: hover)').matches) return;

        var hero = document.querySelector('.hero-section');
        if (!hero) return;

        var fc1 = document.querySelector('.ifc-1');
        var fc2 = document.querySelector('.ifc-2');
        var fc3 = document.querySelector('.ifc-3');
        var ring = document.querySelector('.hero-decor-ring');

        var targetX = 0;
        var targetY = 0;
        var currentX = 0;
        var currentY = 0;
        var animating = false;

        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;

            if (!animating) {
                animating = true;
                requestAnimationFrame(updateParallax);
            }
        });

        hero.addEventListener('mouseleave', function () {
            targetX = 0;
            targetY = 0;
            if (!animating) {
                animating = true;
                requestAnimationFrame(updateParallax);
            }
        });

        function updateParallax() {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            if (fc1) fc1.style.transform = 'translate(' + (currentX * 15) + 'px, ' + (currentY * 10) + 'px)';
            if (fc2) fc2.style.transform = 'translate(' + (currentX * 20) + 'px, ' + (currentY * 15) + 'px)';
            if (fc3) fc3.style.transform = 'translate(' + (currentX * 10) + 'px, ' + (currentY * 8) + 'px)';
            if (ring) ring.style.transform = 'translate(' + (currentX * -12) + 'px, ' + (currentY * -12) + 'px) rotate(' + (currentX * 10) + 'deg)';

            // Keep animating until close to target
            if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
                requestAnimationFrame(updateParallax);
            } else {
                animating = false;
            }
        }
    }


    /* ==========================================================
       10. CUSTOM CURSOR (Desktop only)
    ========================================================== */
    function initCustomCursor() {
        // Only show on devices with fine pointer + hover
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var dot = document.querySelector('.cursor-dot');
        var outline = document.querySelector('.cursor-outline');
        if (!dot || !outline) return;

        var mouseX = -100;
        var mouseY = -100;
        var outlineX = -100;
        var outlineY = -100;

        // Dot follows instantly
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
        });

        // Outline follows with smooth lerp
        function followOutline() {
            outlineX += (mouseX - outlineX) * 0.13;
            outlineY += (mouseY - outlineY) * 0.13;
            outline.style.transform = 'translate(' + outlineX + 'px, ' + outlineY + 'px) translate(-50%, -50%)';
            requestAnimationFrame(followOutline);
        }
        followOutline();

        // Expand on interactive elements
        var interactives = document.querySelectorAll(
            'a, button, .service-card, .tool-card, .contact-info-card, ' +
            '.social-circle, .vcard-scene, .btn-back-top, .menu-toggle'
        );

        for (var i = 0; i < interactives.length; i++) {
            interactives[i].addEventListener('mouseenter', function () {
                outline.classList.add('expanded');
            });
            interactives[i].addEventListener('mouseleave', function () {
                outline.classList.remove('expanded');
            });
        }
    }


    /* ==========================================================
       11. NAVIGATION
       - Scroll: header bg, back-to-top, active link
       - Hamburger: mobile menu
       - Smooth scroll
    ========================================================== */
    function initNavigation() {
        var header = document.getElementById('mainHeader');
        var backToTop = document.getElementById('btnBackTop');
        var menuToggle = document.getElementById('menuToggle');
        var mobileOverlay = document.getElementById('mobileOverlay');
        var navItems = document.querySelectorAll('.nav-item');
        var mobileLinks = document.querySelectorAll('.mobile-link');

        var scrollTicking = false;
        var currentActive = 'hero';

        // ---- Scroll handler (throttled with rAF) ----
        function handleScroll() {
            var y = window.scrollY || window.pageYOffset;

            // Header background — dead zone prevents glitch
            if (y > 80) {
                if (!header.classList.contains('header-scrolled')) {
                    header.classList.add('header-scrolled');
                }
            } else if (y < 30) {
                header.classList.remove('header-scrolled');
            }

            // Back to top button
            if (y > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Active nav link
            var sections = document.querySelectorAll('section[id]');
            var newActive = currentActive;

            for (var i = sections.length - 1; i >= 0; i--) {
                if (y >= sections[i].offsetTop - 160) {
                    newActive = sections[i].id;
                    break;
                }
            }

            if (newActive !== currentActive) {
                currentActive = newActive;
                for (var j = 0; j < navItems.length; j++) {
                    var sec = navItems[j].getAttribute('data-section');
                    if (sec === currentActive) {
                        navItems[j].classList.add('active');
                    } else {
                        navItems[j].classList.remove('active');
                    }
                }
            }
        }

        window.addEventListener('scroll', function () {
            if (!scrollTicking) {
                requestAnimationFrame(function () {
                    handleScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        // ---- Back to top click ----
        if (backToTop) {
            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ---- Mobile menu toggle ----
        function closeMobileMenu() {
            if (menuToggle) menuToggle.classList.remove('open');
            if (mobileOverlay) mobileOverlay.classList.remove('open');
            if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', 'true');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        function openMobileMenu() {
            if (menuToggle) menuToggle.classList.add('open');
            if (mobileOverlay) mobileOverlay.classList.add('open');
            if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', 'false');
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        if (menuToggle) {
            menuToggle.addEventListener('click', function () {
                if (menuToggle.classList.contains('open')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
        }

        // Close on mobile link click
        for (var m = 0; m < mobileLinks.length; m++) {
            mobileLinks[m].addEventListener('click', closeMobileMenu);
        }

        // ---- Smooth scroll for all hash links ----
        var hashLinks = document.querySelectorAll('a[href^="#"]');
        for (var h = 0; h < hashLinks.length; h++) {
            hashLinks[h].addEventListener('click', function (e) {
                e.preventDefault();
                var targetSelector = this.getAttribute('href');
                var target = document.querySelector(targetSelector);

                if (target) {
                    var headerHeight = header ? header.offsetHeight : 75;
                    var targetTop = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                closeMobileMenu();
            });
        }
    }


    /* ==========================================================
       12. VISITING CARD FLIP
       Works on CLICK (desktop) + TAP (mobile).
       Uses .is-flipped on .vcard-scene → CSS rotates .vcard-flipper.
    ========================================================== */
    function initVCardFlip() {
        var scene = document.getElementById('vcardScene');
        if (!scene) return;

        var isFlipped = false;
        var touchMoved = false;

        // --- Click (desktop + fallback) ---
        scene.addEventListener('click', function (e) {
            e.preventDefault();
            toggleFlip();
        });

        // --- Touch support (mobile) ---
        scene.addEventListener('touchstart', function () {
            touchMoved = false;
        }, { passive: true });

        scene.addEventListener('touchmove', function () {
            touchMoved = true;
        }, { passive: true });

        scene.addEventListener('touchend', function (e) {
            // Only flip if it was a tap, not a scroll/swipe
            if (!touchMoved) {
                e.preventDefault();
                toggleFlip();
            }
        });

        function toggleFlip() {
            isFlipped = !isFlipped;
            if (isFlipped) {
                scene.classList.add('is-flipped');
            } else {
                scene.classList.remove('is-flipped');
            }
        }
    }


    /* ==========================================================
       13. CONTACT FORM → WHATSAPP
    ========================================================== */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nameEl = document.getElementById('cfName');
            var phoneEl = document.getElementById('cfPhone');
            var subjectEl = document.getElementById('cfSubject');
            var messageEl = document.getElementById('cfMessage');

            var name = nameEl ? nameEl.value.trim() : '';
            var phone = phoneEl ? phoneEl.value.trim() : '';
            var subject = subjectEl ? subjectEl.value.trim() : '';
            var message = messageEl ? messageEl.value.trim() : '';

            // Validation
            if (!name || !phone || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Build WhatsApp message
            var whatsappText = encodeURIComponent(
                'Hello Abhinoor!\n\n' +
                '*Name:* ' + name + '\n' +
                '*Phone:* ' + phone + '\n' +
                '*Subject:* ' + subject + '\n' +
                '*Message:* ' + message
            );

            var whatsappURL = 'https://wa.me/918054186763?text=' + whatsappText;

            // Open WhatsApp
            window.open(whatsappURL, '_blank');

            // Reset form
            form.reset();
        });
    }


})();
