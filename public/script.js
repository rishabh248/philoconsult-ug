const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggleBtn.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
}

let locomotiveScroll;
function initLocomotiveScroll() {
    try {
        if (!isMobile) {
            locomotiveScroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                multiplier: 1,
                lerp: 0.1,
                smartphone: {
                    smooth: false
                },
                tablet: {
                    smooth: false
                }
            });

            locomotiveScroll.on('scroll', () => {
                if (window.swiper) {
                    window.swiper.update();
                }
            });
        } else {
            document.querySelectorAll('[data-scroll-to]').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }
    } catch (error) {
        console.error('Locomotive Scroll initialization failed:', error);
        document.querySelectorAll('[data-scroll-to]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌞';
    }

    initLocomotiveScroll();
    setupMenuLinks();
    setupGSAPAnimations();
    setupSwiper();
    setupFormSubmission();
});

const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("menu-overlay");
const closeMenu = document.getElementById("close-menu");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        menuOverlay.classList.add("active");
    });
}

if (closeMenu) {
    closeMenu.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
    });
}

function setupMenuLinks() {
    const menuLinks = document.querySelectorAll('.menu-links a[data-scroll-to]');
    const footerLinks = document.querySelectorAll('.footer-links a[data-scroll-to]');
    const heroFooterLinks = document.querySelectorAll('#herofooter a[data-scroll-to]');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                menuOverlay.classList.remove("active");
                setTimeout(() => {
                    if (!isMobile && locomotiveScroll) {
                        locomotiveScroll.scrollTo(targetSection, {
                            offset: -50,
                            duration: 1000,
                            easing: [0.25, 0.00, 0.35, 1.00]
                        });
                    } else {
                        window.scrollTo({
                            top: targetSection.offsetTop - 50,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            } else {
                console.error(`Target section with ID "${targetId}" not found.`);
            }
        });
    });

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                if (!isMobile && locomotiveScroll) {
                    locomotiveScroll.scrollTo(targetSection, {
                        offset: -50,
                        duration: 1000,
                        easing: [0.25, 0.00, 0.35, 1.00]
                    });
                } else {
                    window.scrollTo({
                        top: targetSection.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    heroFooterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                if (!isMobile && locomotiveScroll) {
                    locomotiveScroll.scrollTo(targetSection, {
                        offset: -50,
                        duration: 1000,
                        easing: [0.25, 0.00, 0.35, 1.00]
                    });
                } else {
                    window.scrollTo({
                        top: targetSection.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function setupGSAPAnimations() {
    try {
        gsap.from(".boundingelem", { opacity: 0, y: 50, duration: 0.8, stagger: 0.2 });
        gsap.from(".boundingelem1", { opacity: 0, y: 50, duration: 0.8, delay: 0.5 });
        gsap.from("#zero", { opacity: 0, y: 30, duration: 0.8 });
        gsap.from("#one h2, #sec h2, #thir h2, #for h2", { opacity: 0, y: 30, duration: 0.8, stagger: 0.2 });
        gsap.from("#query h2", { opacity: 0, y: 30, duration: 0.8 });
        gsap.from(".query-form", { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
        gsap.from(".faq-section h2", { opacity: 0, y: 30, duration: 0.8 });
        gsap.from(".swiper-slide", { opacity: 0, y: 30, stagger: 0.2, duration: 0.8 });
        gsap.from(".live-section h2", { opacity: 0, y: 30, duration: 0.8 });
        gsap.from(".live-content p", { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
        gsap.from(".schedule-card", { opacity: 0, y: 30, stagger: 0.2, duration: 0.8 });
        gsap.from(".about-section h2", { opacity: 0, y: 30, duration: 0.8 });
        gsap.from(".about-section p", { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
        gsap.from(".social-link", { y: -10, duration: 1, repeat: -1, yoyo: true, stagger: 0.2, ease: 'power1.inOut' });

        if (!isMobile && locomotiveScroll) {
            locomotiveScroll.on('scroll', (args) => {
                // Add scroll-triggered animations if needed
            });
        }
    } catch (error) {
        console.error('GSAP animation failed:', error);
        document.querySelectorAll('.boundingelem, .boundingelem1, #zero, #one h2, #sec h2, #thir h2, #for h2, #query h2, .query-form, .faq-section h2, .swiper-slide, .live-section h2, .live-content p, .schedule-card, .about-section h2, .about-section p').forEach(elem => {
            elem.style.opacity = '1';
            elem.style.transform = 'translateY(0)';
        });
    }
}

if (!isMobile) {
    const cursor = document.querySelector('#minicircle');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX - 6,
                y: e.clientY - 6,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        document.querySelectorAll('a, button, .swiper-slide, .submit-btn, .schedule-btn').forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            });
            elem.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });

        document.querySelectorAll('.swiper-slide').forEach(slide => {
            slide.addEventListener('mouseenter', () => {
                gsap.to(slide, { scale: 1.1, duration: 0.3 });
            });
            slide.addEventListener('mouseleave', () => {
                gsap.to(slide, { scale: 1, duration: 0.3 });
            });
        });
    }
}

function setupSwiper() {
    try {
        window.swiper = new Swiper(".swiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }
        });

        if (!isMobile && locomotiveScroll) {
            locomotiveScroll.on('call', () => {
                window.swiper.update();
            });
        }
    } catch (error) {
        console.error('Swiper initialization failed:', error);
    }
}

function setupFormSubmission() {
    const queryForm = document.getElementById('query-form');
    const formFeedback = document.getElementById('form-feedback');
    
    if (queryForm) {
        queryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const category = document.getElementById('category').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const queryText = document.getElementById('query-text').value;

            const sanitizedQueryText = queryText.replace(/[<>{}]/g, '');
            const sanitizedName = name.replace(/[<>{}]/g, '');

            if (category && sanitizedName && email && sanitizedQueryText) {
                try {
                    const response = await fetch('http://localhost:10001/submit-query', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: sanitizedName, email, query: sanitizedQueryText })
                    });
                    const result = await response.json();
                    formFeedback.textContent = result.message;
                    formFeedback.style.color = '#bb86fc';
                    queryForm.reset();
                } catch (error) {
                    formFeedback.textContent = 'Error submitting query. Please try again.';
                    formFeedback.style.color = '#ff5555';
                }
            } else {
                formFeedback.textContent = 'Please fill out all fields.';
                formFeedback.style.color = '#ff5555';
            }
        });
    }
}