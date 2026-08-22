// SiyaRam Taxi Services - Main Application Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight Active Page Link (Desktop & Mobile)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a, #mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('http') && !href.startsWith('https') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            const linkPath = href.split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('text-brand', 'active-nav-link');
                link.classList.remove('text-slate-200', 'text-slate-400');
            }
        }
    });

    // 2. Typewriter Effect (Only on Home Page)
    const typewriterTarget = document.getElementById('typewriter');
    if (typewriterTarget) {
        const fullHeadline = 'Trusted Taxi Service in Satna';
        let charIndex = 0;
        function typeHeadline() {
            if (charIndex <= fullHeadline.length) {
                typewriterTarget.textContent = fullHeadline.slice(0, charIndex);
                charIndex += 1;
                setTimeout(typeHeadline, charIndex < fullHeadline.length ? 70 : 120);
            }
        }
        setTimeout(typeHeadline, 600);
    }

    // 3. Library Initialization (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 1000, 
            easing: 'ease-out-quint', 
            once: true, 
            offset: 100 
        });
    }

    // 4. Navbar Sticky Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const applyNavbarState = () => {
            if (window.scrollY > 40) {
                navbar.classList.add('nav-solid');
            } else {
                // Only remove solid background if we are on the home page (where it's transparent at top)
                if (currentPath === 'index.html' || currentPath === '') {
                    navbar.classList.remove('nav-solid');
                }
            }
        };
        applyNavbarState();
        window.addEventListener('scroll', applyNavbarState);
    }

    // 5. Counters Animation (Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const animateCounter = (element) => {
            const target = Number(element.dataset.target);
            const duration = 2000;
            const startTime = performance.now();
            const updateCounter = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                element.textContent = Math.floor(eased * target).toLocaleString('en-IN');
                if (progress < 1) requestAnimationFrame(updateCounter);
                else element.textContent = target.toLocaleString('en-IN');
            };
            requestAnimationFrame(updateCounter);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.done) {
                    entry.target.dataset.done = 'true';
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach((counter) => counterObserver.observe(counter));
    }

    // 6. Mobile Side Menu
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    if (menuToggle && menuClose && mobileMenu && mobileBackdrop) {
        const openMenu = () => {
            mobileMenu.classList.remove('translate-x-full');
            mobileBackdrop.classList.remove('pointer-events-none', 'opacity-0');
            document.body.classList.add('overflow-hidden');
            menuToggle.setAttribute('aria-expanded', 'true');
        };
        const closeMenu = () => {
            mobileMenu.classList.add('translate-x-full');
            mobileBackdrop.classList.add('pointer-events-none', 'opacity-0');
            document.body.classList.remove('overflow-hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        };
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        mobileBackdrop.addEventListener('click', closeMenu);

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
                closeMenu();
            }
        });

        // Auto close menu when clicking any mobile link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // 7. Booking Form Handler (WhatsApp Redirect)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const whatsappMessage = `Hi SiyaRam Taxi Services,\n\nI want to book a cab.\nName: ${name}\nPhone: ${phone}\nDetails: ${message}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            window.open(`https://api.whatsapp.com/send?phone=7999515625&text=${encodedMessage}`, '_blank');
        });
    }
});
