/* =========================================
   MAJESTIC AURA — MAIN SCRIPT
   ========================================= */

(function () {
    'use strict';

    /* ========== 1. NAVBAR SCROLL EFFECT ========== */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 60);
        backToTop.classList.toggle('visible', scrollY > 500);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ========== 2. MOBILE MENU ========== */
    const menuToggle = document.getElementById('menuToggle');
    const navRight = document.getElementById('navRight');

    function closeMenu() {
        navRight.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }

    menuToggle.addEventListener('click', function () {
        navRight.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (navRight.classList.contains('active') &&
            !navRight.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    /* ========== 3. LANGUAGE TOGGLE (EN / AR) ========== */
    const langToggle = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('siteLang') || 'en';

    function setLanguage(lang) {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute('data-' + lang);
            if (translation) {
                if (translation.includes('<span>')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            const ph = el.getAttribute('data-' + lang + '-placeholder');
            if (ph) el.placeholder = ph;
        });

        langToggle.textContent = lang === 'ar' ? 'English' : 'عربي';
        localStorage.setItem('siteLang', lang);
        currentLang = lang;
    }

    setLanguage(currentLang);

    langToggle.addEventListener('click', function (e) {
        e.preventDefault();
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });

    /* ========== 4. SCROLL REVEAL ========== */
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ========== 5. ANIMATED COUNTERS ========== */
    const counterElements = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        const statsBar = document.querySelector('.stats-bar');
        if (!statsBar) return;

        const rect = statsBar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            counterElements.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    /* ========== 6. FAQ ACCORDION ========== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    /* ========== 7. CONTACT FORM ========== */
    const weddingForm = document.getElementById('weddingForm');

    if (weddingForm) {
        weddingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('[name="name"]').value.trim();
            const email = this.querySelector('[name="email"]').value.trim();
            const message = this.querySelector('[name="message"]').value.trim();

            if (!name || !email || !message) {
                alert(currentLang === 'ar'
                    ? 'يرجى ملء جميع الحقول المطلوبة.'
                    : 'Please fill in all required fields.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert(currentLang === 'ar'
                    ? 'يرجى إدخال بريد إلكتروني صحيح.'
                    : 'Please enter a valid email address.');
                return;
            }

            alert(currentLang === 'ar'
                ? 'شكراً لك! تم إرسال استفسارك إلى ماجستيك أورا. سنتواصل معك خلال 24 ساعة.'
                : 'Thank you! Your inquiry has been sent to Majestic Aura. We will contact you within 24 hours.');
            this.reset();
        });
    }

    /* ========== 8. NEWSLETTER ========== */
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert(currentLang === 'ar'
                ? 'شكراً لاشتراكك! ترقب إلهام الزفاف في بريدك.'
                : 'Thank you for subscribing! Look out for wedding inspiration in your inbox.');
            this.reset();
        });
    }

    /* ========== 9. HERO PARTICLES ========== */
    const particlesContainer = document.getElementById('particles');

    if (particlesContainer) {
        const particleCount = window.innerWidth < 768 ? 12 : 28;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    /* ========== 10. BACK TO TOP ========== */
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========== 11. SMOOTH SCROLL ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

})();