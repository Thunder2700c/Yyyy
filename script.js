/* ===========================================================
   ABHINOOR SINGH — FINANCIAL ANALYST
   GSAP Powered — Premium Animations
   =========================================================== */

// Wait for GSAP to load
function init() {
    if (typeof gsap === 'undefined') {
        setTimeout(init, 100);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true, nullTargetWarn: false });

    // ==================== CUSTOM TEXT SPLIT ====================
    function splitText(el) {
        const text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            el.appendChild(span);
        });
        return el.querySelectorAll('.char');
    }

    // Split hero name lines
    const heroLines = document.querySelectorAll('[data-split]');
    const allChars = [];
    heroLines.forEach(line => {
        const chars = splitText(line);
        allChars.push(chars);
    });

    // ==================== LOADER ====================
    const loaderTL = gsap.timeline();

    loaderTL
        .to('.loader-logo', {
            scale: 1.1,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        })
        .from('.loader-letter', {
            yPercent: 120,
            opacity: 0,
            duration: 0.5,
            stagger: { each: 0.05, from: 'start' },
            ease: 'power4.out'
        }, '-=0.5')
        .to('#loaderFill', {
            width: '100%',
            duration: 1.2,
            ease: 'power2.inOut'
        }, '-=0.3')
        .to('.loader', {
            yPercent: -100,
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                document.getElementById('loader').style.display = 'none';
                heroEntrance();
            }
        }, '+=0.3');

    // ==================== HERO ENTRANCE ====================
    function heroEntrance() {
        const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

        heroTL
            // Badge
            .to('.hero-badge', {
                opacity: 1,
                y: 0,
                duration: 0.6
            })
            // Name chars - line 1
            .to(allChars[0], {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: { each: 0.03, from: 'start' }
            }, '-=0.3')
            // Name chars - line 2
            .to(allChars[1], {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: { each: 0.03, from: 'start' }
            }, '-=0.5')
            // Title row
            .to('.hero-title-row', {
                opacity: 1,
                duration: 0.5
            }, '-=0.4')
            .to('.title-line-left', {
                width: 40,
                duration: 0.6
            }, '-=0.4')
            .to('.title-line-right', {
                width: 40,
                duration: 0.6
            }, '-=0.6')
            // Description
            .to('.hero-desc', {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, '-=0.3')
            // Buttons
            .to('.hero-btns', {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, '-=0.3')
            // Visual
            .to('.hero-visual', {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            // Float cards
            .to('.float-card', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            // Stats bar
            .to('.hero-stats', {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, '-=0.3')
            // Scroll indicator
            .to('.scroll-down', {
                opacity: 1,
                duration: 0.5
            }, '-=0.2');

        // Counter animation
        document.querySelectorAll('.h-stat-num').forEach(el => {
            const target = parseInt(el.dataset.target);
            gsap.to(el, {
                textContent: target,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: '.hero-stats',
                    start: 'top 90%'
                }
            });
        });
    }

    // Set initial states for hero
    gsap.set('.hero-badge', { opacity: 0, y: 20 });
    gsap.set('.hero-desc', { opacity: 0, y: 20 });
    gsap.set('.hero-btns', { opacity: 0, y: 20 });
    gsap.set('.hero-visual', { opacity: 0, x: 60 });
    gsap.set('.float-card', { opacity: 0, scale: 0.5 });
    gsap.set('.hero-stats', { opacity: 0, y: 30 });
    gsap.set('.scroll-down', { opacity: 0 });

    // ==================== FLOAT CARD ANIMATION ====================
    gsap.to('.fc-1', {
        y: -15,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2.5
    });
    gsap.to('.fc-2', {
        y: -12,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3
    });
    gsap.to('.fc-3', {
        y: -10,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3.5
    });

    // ==================== ABOUT SECTION ====================
    gsap.from('.about-visual', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%'
        },
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.about-content .sec-label', {
        scrollTrigger: { trigger: '.about-content', start: 'top 75%' },
        x: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.about-heading', {
        scrollTrigger: { trigger: '.about-heading', start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    gsap.from('.about-desc', {
        scrollTrigger: { trigger: '.about-content', start: 'top 70%' },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.info-item', {
        scrollTrigger: { trigger: '.about-info', start: 'top 80%' },
        y: 25,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.about-btns', {
        scrollTrigger: { trigger: '.about-btns', start: 'top 85%' },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    });

    gsap.from('.about-exp-badge', {
        scrollTrigger: { trigger: '.about-visual', start: 'top 60%' },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.4
    });

    // ==================== SERVICES ====================
    gsap.from('.services .sec-header', {
        scrollTrigger: { trigger: '.services', start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    gsap.from('.srv-card', {
        scrollTrigger: { trigger: '.services-grid', start: 'top 75%' },
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: { each: 0.1, from: 'start' },
        ease: 'power3.out'
    });

    // ==================== SKILLS ====================
    gsap.from('.skills .sec-header', {
        scrollTrigger: { trigger: '.skills', start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    gsap.from('.sk-item', {
        scrollTrigger: { trigger: '.skills-bars', start: 'top 75%' },
        x: -40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Skill bars fill
    document.querySelectorAll('.sk-fill').forEach(bar => {
        const w = bar.dataset.w;
        gsap.to(bar, {
            width: w + '%',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%'
            }
        });
    });

    gsap.from('.skills-tools h3', {
        scrollTrigger: { trigger: '.skills-tools', start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    });

    gsap.from('.tool', {
        scrollTrigger: { trigger: '.tools-grid', start: 'top 80%' },
        y: 30,
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: { each: 0.06, from: 'start' },
        ease: 'back.out(1.4)'
    });

    // ==================== VCARD ====================
    gsap.from('.vcard-section .sec-header', {
        scrollTrigger: { trigger: '.vcard-section', start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    gsap.from('.vcard-3d', {
        scrollTrigger: { trigger: '.vcard-wrap', start: 'top 75%' },
        y: 60,
        opacity: 0,
        rotateX: 15,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Card flip
    const vcard = document.getElementById('vcard3d');
    if (vcard) {
        vcard.addEventListener('click', () => vcard.classList.toggle('flipped'));
    }

    // ==================== CONTACT ====================
    gsap.from('.contact .sec-header', {
        scrollTrigger: { trigger: '.contact', start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    gsap.from('.cc-card', {
        scrollTrigger: { trigger: '.contact-cards', start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out'
    });

    gsap.from('.contact-form-box', {
        scrollTrigger: { trigger: '.contact-form-box', start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    gsap.from('.soc-btn', {
        scrollTrigger: { trigger: '.social-area', start: 'top 85%' },
        y: 20,
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)'
    });

    // ==================== NAVBAR ====================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const allNavLinks = document.querySelectorAll('.nav-link');

    let lastScrollY = 0;
    let ticking = false;
    let currentActive = 'home';

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

    function handleScroll(y) {
        // Navbar — dead zone prevents glitch
        if (y > 80 && !navbar.classList.contains('scrolled')) {
            navbar.classList.add('scrolled');
        } else if (y < 30 && navbar.classList.contains('scrolled')) {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (y > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');

        // Active link
        const sections = document.querySelectorAll('section[id]');
        let newActive = currentActive;

        for (let i = sections.length - 1; i >= 0; i--) {
            const sec = sections[i];
            if (y >= sec.offsetTop - 150) {
                newActive = sec.id;
                break;
            }
        }

        if (newActive !== currentActive) {
            currentActive = newActive;
            allNavLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentActive}`);
            });
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
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

    // ==================== CONTACT FORM → WHATSAPP ====================
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
                `Hello Abhinoor!\n\n` +
                `*Name:* ${name}\n` +
                `*Phone:* ${phone}\n` +
                `*Subject:* ${subject}\n` +
                `*Message:* ${message}`
            );

            window.open(`https://wa.me/918054186763?text=${msg}`, '_blank');
            form.reset();
        });
    }

    // ==================== CUSTOM CURSOR ====================
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (dot && ring && window.innerWidth > 768) {
        let mx = 0, my = 0, rx = 0, ry = 0;

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

    // ==================== HERO PARTICLES ====================
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.classList.add('h-particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.width = (Math.random() * 3 + 1) + 'px';
            p.style.height = p.style.width;
            particlesContainer.appendChild(p);

            gsap.to(p, {
                y: -100 - Math.random() * 200,
                x: (Math.random() - 0.5) * 100,
                opacity: 0.6,
                duration: 4 + Math.random() * 4,
                repeat: -1,
                delay: Math.random() * 4,
                ease: 'none',
                yoyo: false,
                modifiers: {
                    opacity: (val) => {
                        const progress = gsap.getProperty(p, 'y');
                        return Math.abs(progress) < 50 ? '0' : val;
                    }
                }
            });

            gsap.fromTo(p, { opacity: 0 }, {
                opacity: 0.5,
                duration: 2,
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 3,
                ease: 'sine.inOut'
            });
        }
    }

    // ==================== PARALLAX ON HERO (Desktop) ====================
    if (window.innerWidth > 768) {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', e => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to('.fc-1', { x: x * 15, y: y * 10, duration: 0.5, overwrite: 'auto' });
                gsap.to('.fc-2', { x: x * 20, y: y * 15, duration: 0.5, overwrite: 'auto' });
                gsap.to('.fc-3', { x: x * 10, y: y * 8, duration: 0.5, overwrite: 'auto' });
            });
        }
    }

    // ==================== FOOTER REVEAL ====================
    gsap.from('.footer-top', {
        scrollTrigger: { trigger: '.footer', start: 'top 90%' },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    });
}

// Start
init();
