/**
 * Luxora Jewelry - Main JavaScript
 * Interactive functionality for the jewelry shop website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialSlider();
    initContactForm();
    initScrollToTop();
});

/**
 * Header - Change background on scroll
 */
function initHeader() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Scroll Animations - Fade in elements on scroll
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (!fadeElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(function(el) {
        observer.observe(el);
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !dots.length) return;
    
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoplayInterval;
    
    function goToSlide(index) {
        currentSlide = index;
        
        // Move track
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        
        // Update dots
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }
    
    // Dot click handlers
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoplay();
        });
    });
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    startAutoplay();
    
    // Pause on hover
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        slider.addEventListener('mouseenter', function() {
            clearInterval(autoplayInterval);
        });
        
        slider.addEventListener('mouseleave', function() {
            startAutoplay();
        });
    }
}

/**
 * Contact Form - Validation and submission
 */
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    const successMessage = document.querySelector('.form-success');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        
        // Validation flags
        let isValid = true;
        
        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        } else {
            clearError(name);
        }
        
        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(email);
        }
        
        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else {
            clearError(message);
        }
        
        // If valid, show success message
        if (isValid) {
            if (successMessage) {
                successMessage.classList.add('show');
            }
            
            // Reset form
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                if (successMessage) {
                    successMessage.classList.remove('show');
                }
            }, 5000);
        }
    });
    
    // Real-time validation on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            clearError(input);
        });
    });
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorEl = formGroup.querySelector('.error-message');
        
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.color = '#ff6b6b';
            errorEl.style.fontSize = '12px';
            errorEl.style.display = 'block';
            errorEl.style.marginTop = '5px';
            formGroup.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        input.style.borderColor = '#ff6b6b';
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.error-message');
        
        if (errorEl) {
            errorEl.remove();
        }
        
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Scroll to Top Button
 */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth scroll for navigation links (fallback for older browsers)
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Lazy loading for images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
    });
}

