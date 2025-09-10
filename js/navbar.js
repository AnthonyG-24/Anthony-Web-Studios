document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburger = document.getElementById('hamburger');
    const navRight = document.getElementById('navRight');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    body.appendChild(overlay);
    
    // Get all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu function
    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Open menu function
    function openMenu() {
        hamburger.classList.add('active');
        navRight.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('nav-open');
        
        // Add ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', 'true');
        navRight.setAttribute('aria-hidden', 'false');
        
        // Focus trap - focus first nav item
        if (window.innerWidth <= 820) {
            const firstNavLink = navRight.querySelector('.nav-link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 300);
            }
        }
    }
    
    // Close menu function
    function closeMenu() {
        hamburger.classList.remove('active');
        navRight.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('nav-open');
        
        // Add ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', 'false');
        navRight.setAttribute('aria-hidden', 'true');
        
        // Return focus to hamburger button
        if (window.innerWidth <= 820) {
            hamburger.focus();
        }
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when nav link is clicked (for anchor links)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 820) {
                closeMenu();
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });
    
    // Initialize ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navRight');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    navRight.setAttribute('aria-hidden', 'true');
    
    // Smooth scroll to sections
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80; // Account for fixed navbar
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Handle navigation clicks for smooth scrolling
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                smoothScrollTo(href);
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            });
        }
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttle scroll event for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
    
    // Initial active state setup
    updateActiveNavLink();
});