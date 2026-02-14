document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const preloader = document.getElementById('preloader');
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const contactForm = document.querySelector('.contact-form');
    const progressBar = document.getElementById('scroll-progress');
    const heroLogo = document.querySelector('.hero-logo');
    const heroShowcase = document.querySelector('.hero-showcase');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroSlideDots = document.querySelectorAll('.hero-slide-dot');
    const heroPrevControl = document.querySelector('.hero-slide-control--prev');
    const heroNextControl = document.querySelector('.hero-slide-control--next');
    const underDevelopmentOverlay = document.getElementById('under-development-overlay');
    const underDevelopmentMessage = underDevelopmentOverlay ? underDevelopmentOverlay.querySelector('.under-development-message') : null;
    const underDevelopmentClose = underDevelopmentOverlay ? underDevelopmentOverlay.querySelector('.under-development-close') : null;
    const underDevelopmentTitle = underDevelopmentOverlay ? underDevelopmentOverlay.querySelector('#under-development-title') : null;
    const underDevelopmentLocked = Boolean(underDevelopmentOverlay && (underDevelopmentOverlay.dataset.locked === 'true' || underDevelopmentOverlay.classList.contains('under-development-overlay--locked')));
    const shouldShowUnderDevelopment = Boolean(!underDevelopmentLocked && body.dataset.showUnderDevelopment === 'true');
    const PRELOADER_FADE_MS = 360; // keep paired with the CSS transition timing for #preloader
    const HERO_SLIDE_DURATION_MS = 5200;
    const FOOTER_PARTIAL_PATH = 'partials/footer.html';
    let preloaderHideTimer = null;
    let heroSlideIndex = 0;
    let heroSlideInterval = null;
    let underDevelopmentPreviousFocus = null;

    const enhanceProtectedMedia = (root = document) => {
        root.querySelectorAll('.protected-media').forEach((media) => {
            if (media.dataset.protectedBound === 'true') {
                return;
            }
            media.addEventListener('contextmenu', (event) => event.preventDefault());
            media.addEventListener('dragstart', (event) => event.preventDefault());
            media.dataset.protectedBound = 'true';
        });
    };

    const setHeroSlide = (index) => {
        if (!heroSlides.length) {
            return;
        }
        heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach((slide, idx) => {
            slide.classList.toggle('is-active', idx === heroSlideIndex);
        });
        heroSlideDots.forEach((dot, idx) => {
            const isActive = idx === heroSlideIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
    };

    const stopHeroSlideshow = () => {
        if (heroSlideInterval) {
            clearInterval(heroSlideInterval);
            heroSlideInterval = null;
        }
    };

    const startHeroSlideshow = () => {
        if (heroSlides.length <= 1) {
            return;
        }
        stopHeroSlideshow();
        heroSlideInterval = window.setInterval(() => {
            setHeroSlide(heroSlideIndex + 1);
        }, HERO_SLIDE_DURATION_MS);
    };

    const setUnderDevelopmentContent = (options = {}) => {
        if (!underDevelopmentOverlay) {
            return;
        }
        if (options.title && underDevelopmentTitle) {
            underDevelopmentTitle.textContent = options.title;
        }
        if (options.message && underDevelopmentMessage) {
            underDevelopmentMessage.textContent = options.message;
        }
    };

    const showUnderDevelopmentOverlay = (options = {}) => {
        if (!underDevelopmentOverlay || underDevelopmentLocked) {
            return;
        }
        setUnderDevelopmentContent(options);
        const activeElement = document.activeElement;
        underDevelopmentPreviousFocus = activeElement && typeof activeElement.focus === 'function' ? activeElement : null;
        underDevelopmentOverlay.classList.add('under-development-overlay--active');
        underDevelopmentOverlay.setAttribute('aria-hidden', 'false');
        body.classList.add('under-development-open');
        if (underDevelopmentClose && typeof underDevelopmentClose.focus === 'function') {
            underDevelopmentClose.focus({ preventScroll: true });
        }
    };

    const hideUnderDevelopmentOverlay = () => {
        if (!underDevelopmentOverlay || underDevelopmentLocked) {
            return;
        }
        underDevelopmentOverlay.classList.remove('under-development-overlay--active');
        underDevelopmentOverlay.setAttribute('aria-hidden', 'true');
        body.classList.remove('under-development-open');
        if (underDevelopmentPreviousFocus && typeof underDevelopmentPreviousFocus.focus === 'function') {
            underDevelopmentPreviousFocus.focus({ preventScroll: true });
        }
        underDevelopmentPreviousFocus = null;
    };

    const bindUnderDevelopmentTriggers = (nodes = []) => {
        if (!shouldShowUnderDevelopment || !underDevelopmentOverlay) {
            return;
        }
        nodes.forEach((node) => {
            if (!node || node.dataset?.underDevelopmentBound === 'true') {
                return;
            }
            node.dataset.underDevelopmentBound = 'true';
            node.dataset.preloaderBound = 'true';
            const handleTrigger = (event) => {
                if (event.type === 'keydown' && event.repeat) {
                    event.preventDefault();
                    return;
                }
                if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
                    return;
                }
                event.preventDefault();
                if (typeof event.stopImmediatePropagation === 'function') {
                    event.stopImmediatePropagation();
                } else {
                    event.stopPropagation();
                }
                showUnderDevelopmentOverlay();
            };
            node.addEventListener('click', handleTrigger);
            if (node instanceof HTMLElement) {
                node.addEventListener('keydown', handleTrigger);
            }
        });
    };

    if (underDevelopmentOverlay && !underDevelopmentLocked) {
        underDevelopmentOverlay.addEventListener('click', (event) => {
            if (event.target === underDevelopmentOverlay) {
                hideUnderDevelopmentOverlay();
            }
        });
        if (underDevelopmentClose) {
            underDevelopmentClose.addEventListener('click', (event) => {
                event.preventDefault();
                hideUnderDevelopmentOverlay();
            });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && underDevelopmentOverlay.classList.contains('under-development-overlay--active')) {
                event.preventDefault();
                hideUnderDevelopmentOverlay();
            }
        });
    }

    if (preloader) {
        preloader.classList.add('is-active');
        body.classList.add('loading');
        body.classList.remove('page-ready');
    }

    if (heroSlides.length) {
        setHeroSlide(0);
        startHeroSlideshow();
        if (!shouldShowUnderDevelopment) {
            heroSlideDots.forEach((dot, idx) => {
                dot.addEventListener('click', () => {
                    const targetIndex = Number.parseInt(dot.dataset.slide ?? idx, 10);
                    setHeroSlide(Number.isNaN(targetIndex) ? idx : targetIndex);
                    startHeroSlideshow();
                });
            });

            if (heroPrevControl) {
                heroPrevControl.addEventListener('click', () => {
                    setHeroSlide(heroSlideIndex - 1);
                    startHeroSlideshow();
                });
            }

            if (heroNextControl) {
                heroNextControl.addEventListener('click', () => {
                    setHeroSlide(heroSlideIndex + 1);
                    startHeroSlideshow();
                });
            }
        } else {
            const heroInteractiveElements = [
                ...Array.from(heroSlides).map((slide) => slide.querySelector('a[href]')).filter(Boolean),
                ...heroSlideDots,
                heroPrevControl,
                heroNextControl,
            ].filter(Boolean);
            bindUnderDevelopmentTriggers(heroInteractiveElements);
        }

        const pauseSlideshow = () => stopHeroSlideshow();
        const resumeSlideshow = () => startHeroSlideshow();

        if (heroShowcase) {
            heroShowcase.addEventListener('mouseenter', pauseSlideshow);
            heroShowcase.addEventListener('mouseleave', resumeSlideshow);
            heroShowcase.addEventListener('focusin', pauseSlideshow);
            heroShowcase.addEventListener('focusout', resumeSlideshow);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopHeroSlideshow();
            } else {
                startHeroSlideshow();
            }
        });
    }

    const updateNavbarState = () => {
        if (window.scrollY > 24) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    const updateProgressBar = () => {
        if (!progressBar) {
            return;
        }
        const doc = document.documentElement;
        const scrollHeight = doc.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    const updateHeroLogoScale = () => {
        if (!heroLogo) {
            return;
        }
        const clampValue = Math.min(window.scrollY / 420, 1);
        const scale = 1 - clampValue * 0.12;
        heroLogo.style.transform = `scale(${scale})`;
    };

    const updateScrollMetrics = () => {
        updateNavbarState();
        updateProgressBar();
        updateHeroLogoScale();
    };

    updateScrollMetrics();
    window.addEventListener('scroll', updateScrollMetrics, { passive: true });
    window.addEventListener('resize', updateScrollMetrics);

    const showPreloaderOverlay = () => {
        if (!preloader) {
            return;
        }
        if (preloaderHideTimer) {
            clearTimeout(preloaderHideTimer);
            preloaderHideTimer = null;
        }
        void preloader.offsetWidth;
        preloader.classList.add('is-active');
        preloader.removeAttribute('aria-hidden');
        body.classList.add('loading');
        body.classList.remove('page-ready');
    };

    const hidePreloaderOverlay = () => {
        if (!preloader || !preloader.classList.contains('is-active')) {
            body.classList.add('page-ready');
            body.classList.remove('loading');
            return;
        }
        preloader.classList.remove('is-active');
        body.classList.remove('loading');
        preloaderHideTimer = setTimeout(() => {
            preloader.setAttribute('aria-hidden', 'true');
            body.classList.add('page-ready');
            updateScrollMetrics();
            preloaderHideTimer = null;
        }, PRELOADER_FADE_MS);
    };

    window.addEventListener('load', hidePreloaderOverlay);
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            hidePreloaderOverlay();
        }
    });

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active', isActive);
            mobileMenu.classList.toggle('hidden', !isActive);
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
            });
        });
    }

    function shouldTriggerPageLoader(link) {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            return false;
        }
        if (link.hasAttribute('download')) {
            return false;
        }
        if (link.target && link.target !== '_self') {
            return false;
        }

        try {
            const destination = new URL(href, window.location.href);
            if (destination.origin !== window.location.origin) {
                return false;
            }
            const samePath = destination.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
            const hasHashOnlyChange = samePath && destination.hash;
            return !hasHashOnlyChange;
        } catch (error) {
            return false;
        }
    }

    const enhanceAnchors = (root = document) => {
        root.querySelectorAll('a[href]').forEach((link) => {
            if (link.dataset.preloaderBound === 'true') {
                return;
            }
            link.dataset.preloaderBound = 'true';
            if (!shouldTriggerPageLoader(link)) {
                return;
            }
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');
                if (!href) {
                    return;
                }
                event.preventDefault();
                let destination;
                try {
                    destination = new URL(href, window.location.href);
                } catch (error) {
                    return;
                }
                if (destination.href === window.location.href) {
                    return;
                }
                showPreloaderOverlay();
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.location.href = destination.href;
                    });
                });
            });
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    const observeAnimatedElements = (root = document) => {
        root.querySelectorAll('[data-animate]').forEach((element) => {
            if (element.dataset.animateObserved === 'true') {
                return;
            }
            observer.observe(element);
            element.dataset.animateObserved = 'true';
        });
    };

    observeAnimatedElements();

    const loadFooterPartial = async () => {
        const targets = document.querySelectorAll('[data-footer-include]');
        if (!targets.length) {
            return;
        }
        const fallbackMarkup = `<footer class="site-footer"><div class="footer-shell"><p class="footer-legal">© 2025 Grace Tech Solutions. <a href="mailto:gtsgratia@gmail.com">gtsgratia@gmail.com</a></p></div></footer>
<a href="https://wa.me/919865179509" target="_blank" rel="noopener" class="whatsapp-button" aria-label="Chat on WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" class="h-7 w-7"><path d="M16.04 2.67C8.82 2.67 2.97 8.52 2.97 15.74c0 2.67.75 4.97 2.2 7.08l-1.45 5.3 5.43-1.42c1.99 1.09 4.17 1.66 6.44 1.66h.01c7.22 0 13.07-5.85 13.07-13.07.01-7.21-5.84-13.07-13.04-13.07zm7.63 18.64c-.32.9-1.86 1.72-2.57 1.83-.66.1-1.51.15-2.45-.15-.57-.18-1.3-.42-2.24-.82-3.94-1.7-6.52-5.66-6.73-5.94-.2-.28-1.61-2.15-1.61-4.1 0-1.94 1.02-2.9 1.39-3.3.36-.4.8-.5 1.06-.5.27 0 .53.01.76.01.24 0 .58-.09.91.69.32.78 1.08 2.7 1.17 2.9.09.2.15.43.03.7-.12.27-.18.43-.36.66-.18.23-.38.51-.54.68-.18.18-.36.37-.16.73.2.37.88 1.45 1.89 2.35 1.3 1.16 2.39 1.53 2.77 1.7.36.15.57.12.78-.07.2-.18.89-1.03 1.13-1.39.24-.36.47-.3.79-.18.32.12 2.05.97 2.4 1.15.36.18.6.27.69.42.09.15.09.88-.23 1.78z" /></svg></a>`;
        try {
            const response = await fetch(FOOTER_PARTIAL_PATH, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Failed to load footer partial: ${response.status}`);
            }
            const footerMarkup = await response.text();
            targets.forEach((target) => {
                target.innerHTML = footerMarkup;
                enhanceProtectedMedia(target);
                enhanceAnchors(target);
                observeAnimatedElements(target);
            });
        } catch (error) {
            console.error('Unable to load footer partial', error);
            targets.forEach((target) => {
                target.innerHTML = fallbackMarkup;
                enhanceProtectedMedia(target);
                enhanceAnchors(target);
                observeAnimatedElements(target);
            });
        }
    };

    enhanceProtectedMedia();
    enhanceAnchors();
    void loadFooterPartial();

    if (shouldShowUnderDevelopment) {
        const catalogueTriggers = new Set([
            ...document.querySelectorAll('#products .product-card'),
            ...document.querySelectorAll('#products .cta-button'),
        ]);
        bindUnderDevelopmentTriggers([...catalogueTriggers]);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        document.querySelectorAll('[data-under-development-section]').forEach((section) => {
            if (section.dataset.autoScrollBound === 'true') {
                return;
            }
            section.dataset.autoScrollBound = 'true';
            const targetSelector = section.dataset.autoscrollTarget;
            if (!targetSelector || prefersReducedMotion.matches) {
                return;
            }
            const scrollTarget = document.querySelector(targetSelector);
            if (!scrollTarget) {
                return;
            }
            let autoScrollTimer = null;
            let autoScrollTriggered = false;
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (autoScrollTriggered) {
                            return;
                        }
                        if (entry.isIntersecting) {
                            if (!autoScrollTimer) {
                                autoScrollTimer = window.setTimeout(() => {
                                    autoScrollTriggered = true;
                                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    if (autoScrollTimer) {
                                        window.clearTimeout(autoScrollTimer);
                                        autoScrollTimer = null;
                                    }
                                    observer.disconnect();
                                }, 5200);
                            }
                        } else if (autoScrollTimer) {
                            window.clearTimeout(autoScrollTimer);
                            autoScrollTimer = null;
                        }
                    });
                },
                { threshold: 0.6 }
            );
            observer.observe(section);
        });

        document.querySelectorAll('#products [data-scroll-target]').forEach((control) => {
            if (control.dataset.scrollTargetBound === 'true') {
                return;
            }
            control.dataset.scrollTargetBound = 'true';
            control.addEventListener('click', (event) => {
                event.preventDefault();
                const selector = control.dataset.scrollTarget;
                if (!selector) {
                    return;
                }
                const target = document.querySelector(selector);
                if (!target) {
                    return;
                }
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const button = contactForm.querySelector('.submit-button');
            if (!button) {
                return;
            }
            const originalText = button.textContent;
            button.textContent = 'Sending…';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = 'Message Sent!';
            }, 600);

            setTimeout(() => {
                contactForm.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 2600);
        });
    }

});
