// Main JavaScript for Portfolio Website
class Portfolio {
    constructor() {
        this.currentSection = 'home';
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.setupSkillBars();
        this.setupForm();
        this.setupScrollEffects();
        this.animateOnLoad();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (this.isAnimating) return;
                
                const targetSection = e.target.getAttribute('data-section');
                this.switchSection(targetSection);
            });
        });

        // Handle navigation active states
        this.updateActiveNav = (sectionId) => {
            navItems.forEach(item => item.classList.remove('active'));
            const activeItem = document.querySelector(`[data-section="${sectionId}"]`);
            if (activeItem) activeItem.classList.add('active');
        };
    }

    switchSection(targetSection) {
        if (targetSection === this.currentSection || this.isAnimating) return;

        this.isAnimating = true;
        const currentSectionEl = document.getElementById(this.currentSection);
        const targetSectionEl = document.getElementById(targetSection);

        // Exit animation for current section
        if (currentSectionEl) {
            currentSectionEl.style.opacity = '0';
            currentSectionEl.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                currentSectionEl.classList.remove('active');
                
                // Enter animation for target section
                if (targetSectionEl) {
                    targetSectionEl.classList.add('active');
                    targetSectionEl.style.opacity = '0';
                    targetSectionEl.style.transform = 'translateX(100px)';
                    
                    // Trigger reflow
                    targetSectionEl.offsetHeight;
                    
                    setTimeout(() => {
                        targetSectionEl.style.opacity = '1';
                        targetSectionEl.style.transform = 'translateX(0)';
                        
                        this.currentSection = targetSection;
                        this.updateActiveNav(targetSection);
                        
                        // Re-trigger animations for the new section
                        this.animateSection(targetSectionEl);
                        
                        setTimeout(() => {
                            this.isAnimating = false;
                        }, 500);
                    }, 50);
                }
            }, 300);
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.card, .skill-category, .service-card, .portfolio-card, .education-item, .project-card').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        const delay = Math.random() * 200;
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('animate-fade-in-up');
        }, delay);
    }

    animateSection(section) {
        const elements = section.querySelectorAll('.card, .skill-category, .service-card, .portfolio-card, .education-item, .project-card');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate skill bars if in skills section
        if (section.id === 'skills') {
            setTimeout(() => {
                this.animateSkillBars();
            }, 500);
        }
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        this.animateSkillBars = () => {
            skillBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, index * 100);
            });
        };
    }

    setupForm() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input, textarea');

        // Add focus/blur effects to form inputs
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.classList.add('focused');
                this.addGlowEffect(e.target);
            });

            input.addEventListener('blur', (e) => {
                e.target.parentElement.classList.remove('focused');
                this.removeGlowEffect(e.target);
            });
        });

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.2), 0 4px 6px -1px rgba(14, 165, 233, 0.1)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            console.log('Form submitted:', data);
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(14, 165, 233, 0.9)'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupScrollEffects() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        // Parallax effect for background gradients
        let ticking = false;
        const updateBackground = () => {
            const scrolled = window.pageYOffset;
            const parallax1 = document.querySelector('.radial-gradient-1');
            const parallax2 = document.querySelector('.radial-gradient-2');
            
            if (parallax1 && parallax2) {
                parallax1.style.transform = `translateY(${scrolled * 0.1}px)`;
                parallax2.style.transform = `translateY(${scrolled * -0.1}px)`;
            }
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateBackground);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    animateOnLoad() {
        // Initial load animations
        setTimeout(() => {
            const homeSection = document.getElementById('home');
            if (homeSection && homeSection.classList.contains('active')) {
                this.animateSection(homeSection);
            }
        }, 300);

        // Animate navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate logo
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                logo.style.transition = 'all 0.6s ease';
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Button interaction effects
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });
            
            button.addEventListener('click', (e) => {
                e.target.classList.add('btn-press');
                setTimeout(() => {
                    e.target.classList.remove('btn-press');
                }, 100);
            });
        });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.cssText = `
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${e.clientX - button.offsetLeft - radius}px;
            top: ${e.clientY - button.offsetTop - radius}px;
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(circle);
        
        setTimeout(() => {
            if (circle.parentNode) {
                circle.parentNode.removeChild(circle);
            }
        }, 600);
    }

    // Typing effect for dynamic text
    typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Theme switching (if needed in future)
    toggleTheme() {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    }

    // Accessibility improvements
    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-sky-500);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--color-sky-400) !important;
        outline-offset: 2px;
    }
    
    .notification {
        font-family: var(--font-family);
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio();
    
    // Setup additional effects
    portfolio.setupButtonEffects();
    portfolio.setupAccessibility();
    
    // Performance optimization: Lazy load animations
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            portfolio.setupScrollEffects();
        });
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate animations or layouts if needed
        console.log('Window resized - recalculating layouts');
    }, 250);
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}