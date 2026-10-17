/* =========================================
   MAJESTIC AURA — GALLERY DASHBOARD SCRIPT
   ========================================= */

(function () {
    'use strict';

    /* ========== 1. LANGUAGE TOGGLE ========== */
    const langToggle = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('siteLang') || 'en';

    function setLanguage(lang) {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute('data-' + lang);
            if (translation) el.textContent = translation;
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

    /* ========== 2. GALLERY FILTER ========== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const emptyState = document.getElementById('emptyState');

    function applyFilter(filter) {
        let visibleCount = 0;

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                item.classList.remove('hidden');
                item.style.animation = 'none';
                void item.offsetWidth; // reflow
                item.style.animation = 'itemFadeIn 0.5s ease-out';
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            applyFilter(filter);

            // Smooth scroll to gallery top on mobile after filter
            if (window.innerWidth < 768) {
                const gallerySection = document.querySelector('.gallery-section');
                if (gallerySection) {
                    const offset = gallerySection.getBoundingClientRect().top + window.scrollY - 130;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }
        });
    });

    /* ========== 3. LIGHTBOX ========== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    function openLightbox(index) {
        visibleItems = getVisibleItems();
        if (index < 0 || index >= visibleItems.length) return;

        currentIndex = index;
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const catEl = item.querySelector('.gallery-item-cat');

        if (img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || '';
        }

        if (catEl) {
            lightboxCaption.textContent = catEl.textContent;
        }

        lightbox.hidden = false;
        requestAnimationFrame(() => lightbox.classList.add('active'));
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightbox.hidden = true;
            lightboxImage.src = '';
        }, 400);
    }

    function navigateLightbox(direction) {
        visibleItems = getVisibleItems();
        if (visibleItems.length === 0) return;

        currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const catEl = item.querySelector('.gallery-item-cat');

        // Fade transition
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            if (img) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt || '';
            }
            if (catEl) {
                lightboxCaption.textContent = catEl.textContent;
            }
            lightboxImage.style.opacity = '1';
        }, 200);
    }

    // Attach click to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            visibleItems = getVisibleItems();
            const index = visibleItems.indexOf(this);
            if (index !== -1) openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

    // Close on backdrop click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox(1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
        }
    });

    // Touch swipe in lightbox
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) navigateLightbox(1);
            else navigateLightbox(-1);
        } else if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
            closeLightbox();
        }
    }, { passive: true });

    /* ========== 4. HEADER SCROLL EFFECT ========== */
    const galleryHeader = document.querySelector('.gallery-header');

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        if (scrollY > 100) {
            galleryHeader.style.padding = '8px 4%';
            galleryHeader.style.background = 'rgba(26, 5, 8, 0.98)';
        } else {
            galleryHeader.style.padding = '12px 4%';
            galleryHeader.style.background = 'rgba(26, 5, 8, 0.85)';
        }
    }, { passive: true });

    /* ========== 5. PRELOAD IMAGES (Performance) ========== */
    function preloadNextImages() {
        visibleItems = getVisibleItems();
        visibleItems.forEach((item, index) => {
            if (index > 0 && index < 6) {
                const img = item.querySelector('img');
                if (img) {
                    const preload = new Image();
                    preload.src = img.src;
                }
            }
        });
    }

    // Preload after initial load
    window.addEventListener('load', preloadNextImages);

})();