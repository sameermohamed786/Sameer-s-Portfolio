/* ==========================================================================
   INTERACTIVE SCRIPTS (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    lucide.createIcons();

    // Programmatic Letter-by-Letter hover effect for all section titles
    const textSplitElements = document.querySelectorAll('.section-title');
    textSplitElements.forEach(title => {
        title.classList.add('has-hover-chars');
        const text = title.textContent.trim();
        title.innerHTML = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            span.classList.add('hover-char');
            title.appendChild(span);
        });
    });

    // ==========================================================================
    // 1. PRELOADER
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loader-progress');
    const statusText = document.querySelector('.loader-status');

    const statuses = [
        'Loading Assets...',
        'Building Glass Interfaces...',
        'Optimizing Vectors...',
        'Initializing Canvas...',
        'Active!'
    ];

    let progress = 0;
    let statusIndex = 0;

    const preloaderInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(preloaderInterval);
            
            // Fade out preloader
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.classList.remove('no-scroll');
                
                // Trigger hero reveal animations
                revealHero();
            }, 400);
        }
        
        progressBar.style.width = `${progress}%`;
        
        if (progress > (statusIndex + 1) * 20 && statusIndex < statuses.length - 1) {
            statusIndex++;
            statusText.textContent = statuses[statusIndex];
        }
    }, 80);

    // Backup if loading takes too long
    window.addEventListener('load', () => {
        progress = 100;
        progressBar.style.width = '100%';
        statusText.textContent = statuses[4];
    });

    // Disable scroll on loading
    document.body.classList.add('no-scroll');


    // ==========================================================================
    // 2. HERO REVEAL ANIMATIONS
    // ==========================================================================
    function revealHero() {
        const revealTexts = document.querySelectorAll('.reveal-text');
        const revealFades = document.querySelectorAll('.reveal-fade');
        
        revealTexts.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });

        revealFades.forEach((el) => {
            el.classList.add('revealed');
        });
    }


    // ==========================================================================
    // 3. CUSTOM CURSOR
    // ==========================================================================
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Follow speed (Lerp factor)
    const lerpSpeed = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Lerp loop for outline trailing effect
    function updateCursor() {
        outlineX += (mouseX - outlineX) * lerpSpeed;
        outlineY += (mouseY - outlineY) * lerpSpeed;
        
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
    // Cursor hover effects
    const interactives = document.querySelectorAll('a, button, .project-card, .skill-card, .cert-card, .edu-card, .interest-bubble, input, textarea, .hero-title span, .hover-char');
    
    interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hover-interactive');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-interactive');
        });
    });


    // ==========================================================================
    // 4. CANVAS BACKGROUND PARTICLES
    // ==========================================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 45;
    const connectionDistance = 110;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = Math.random() * 0.15 + 0.05;
            this.alpha = this.baseAlpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Hover attraction effect
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                // Gently pull toward cursor
                this.x += (dx / distance) * 0.2;
                this.y += (dy / distance) * 0.2;
                this.alpha = Math.min(0.4, this.baseAlpha + (1 - distance / 200) * 0.25);
            } else {
                this.alpha = this.baseAlpha;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 102, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.06;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(112, 0, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ==========================================================================
    // 5. STICKY NAVBAR & MOBILE MENU
    // ==========================================================================
    const header = document.querySelector('.glass-header');
    const resumeDropdown = document.querySelector('.resume-dropdown');
    const resumeBtn = document.getElementById('resume-btn');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header Scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Resume Dropdown Click toggle
    resumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resumeDropdown.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        resumeDropdown.classList.remove('open');
    });

    // Mobile Navigation Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });


    // ==========================================================================
    // 6. MAGNETIC BUTTONS EFFECT
    // ==========================================================================
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly toward cursor coordinate
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            
            // If button has an inner element (icon/span), shift it more for parallax
            const children = btn.querySelectorAll('span, i');
            children.forEach((child) => {
                child.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            const children = btn.querySelectorAll('span, i');
            children.forEach((child) => {
                child.style.transform = 'translate(0px, 0px)';
            });
        });
    });


    // ==========================================================================
    // 7. CARD TILT EFFECT (3D ROTATION)
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // cursor x position inside card
            const y = e.clientY - rect.top;  // cursor y position inside card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle (max 10 degrees)
            const rotateX = ((centerY - y) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });





    // ==========================================================================
    // 9. SKILLS TAB SWITCHER
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.skills-category-content');

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Update buttons active class
            tabButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active content
            tabContents.forEach((content) => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                    
                    // Trigger skill bar animation inside active tab
                    animateSkillFills(content);
                }
            });
        });
    });

    // Helper to animate progress bars when viewable
    function animateSkillFills(container) {
        const fills = container.querySelectorAll('.skill-fill');
        fills.forEach((fill) => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = targetWidth;
                fill.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 50);
        });
    }

    // Trigger initial tab animation
    const activeTab = document.querySelector('.skills-category-content.active');
    if (activeTab) animateSkillFills(activeTab);

    // Helper to animate stats count-up
    const animateCount = (el) => {
        el.classList.add('counting');
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0');
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();
        
        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-Out Cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentVal = easeProgress * target;
            el.textContent = currentVal.toFixed(decimals) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.classList.remove('counting');
            }
        };
        
        requestAnimationFrame(update);
    };

    // Simple, bulletproof scroll-triggered counter
    let counterAnimated = false;
    const triggerStatsCounter = () => {
        if (counterAnimated) return;
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const triggerPoint = window.innerHeight - 50; // Trigger when top of stats-grid is 50px inside viewport
        
        if (rect.top < triggerPoint) {
            counterAnimated = true;
            const counters = document.querySelectorAll('.animate-counter');
            counters.forEach((counter, idx) => {
                setTimeout(() => {
                    animateCount(counter);
                }, idx * 150);
            });
            window.removeEventListener('scroll', triggerStatsCounter);
        }
    };
    window.addEventListener('scroll', triggerStatsCounter);
    // Trigger on load after a small delay in case it is already in viewport
    setTimeout(triggerStatsCounter, 600);

    // ==========================================================================
    // 10. SCROLL REVEALS & TIMELINE PROGRESS
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-bottom, .timeline-item');
    const timelineProgress = document.getElementById('timeline-progress-bar');
    const timelineContainer = document.querySelector('.timeline-container');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('active');
                
                // If it's a skill card view, animate the bar fills
                if (entry.target.id === 'skills') {
                    const currentActive = document.querySelector('.skills-category-content.active');
                    if (currentActive) animateSkillFills(currentActive);
                }
                
                // Stop observing once animated
                if (!entry.target.classList.contains('timeline-item')) {
                    observer.unobserve(entry.target);
                }
            } else {
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => {
        elementObserver.observe(el);
    });

    // Scroll Spy for active nav link highlight
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 180;
        
        sections.forEach((sec) => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            
            if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Timeline Progress calculation
        if (timelineContainer && timelineProgress) {
            const timelineRect = timelineContainer.getBoundingClientRect();
            const timelineHeight = timelineRect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate how far the timeline has passed the middle of screen
            const viewportMiddle = windowHeight / 2;
            const passed = viewportMiddle - timelineRect.top;
            
            let percent = (passed / timelineHeight) * 100;
            percent = Math.min(100, Math.max(0, percent));
            
            timelineProgress.style.height = `${percent}%`;
        }

        // Top Scroll progress bar
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (window.scrollY / docHeight) * 100;
        document.getElementById('scroll-progress').style.width = `${scrollPercent}%`;
    });


    // ==========================================================================
    // 11. CASE STUDY DYNAMIC MODAL
    // ==========================================================================
    const modal = document.getElementById('case-study-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBody = document.getElementById('modal-body-content');
    const modalProjectMeta = document.getElementById('modal-project-meta');
    
    const projectCards = document.querySelectorAll('.project-card');
    const casesDb = document.getElementById('cases-db');

    function openModal(projectId) {
        // Fetch case layout from hidden db template
        const template = casesDb.querySelector(`#case-${projectId}`);
        if (!template) return;

        // Clone and inject content
        modalBody.innerHTML = template.innerHTML;
        
        // Define meta tag
        const categoryMeta = template.closest('[id]').id;
        let metaLabel = "Case Study";
        if (projectId === 'c-hub' || projectId === 'sequence' || projectId === 'its-const') {
            metaLabel = "UI/UX Case Study";
        } else if (projectId === 'commodity-mkt' || projectId === 'ompoi-b2b' || projectId === 'hospital') {
            metaLabel = "Developer Case Study";
        }
        modalProjectMeta.textContent = metaLabel;

        // Open modal
        modal.classList.add('open');
        document.body.classList.add('no-scroll');
        
        // Re-init icons inside modal
        lucide.createIcons();
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('no-scroll');
        
        // Clear body content after transition closes
        setTimeout(() => {
            modalBody.innerHTML = '';
        }, 400);
    }

    // Attach click events to project cards
    projectCards.forEach((card) => {
        const openBtn = card.querySelector('.open-case-study');
        const projectId = card.getAttribute('data-project');
        
        card.addEventListener('click', () => {
            openModal(projectId);
        });
    });

    // Close actions
    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Contact Form Submit Handler -> Redirects to WhatsApp with Form Data
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            const text = `Hello Sameer, I would like to collaborate with you!\n\n` +
                         `*Name:* ${name}\n` +
                         `*Email:* ${email}\n` +
                         `*Subject:* ${subject}\n` +
                         `*Project/Opportunity:* ${message}`;
            
            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/919025477476?text=${encodedText}`;
            
            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
            
            // Reset the form
            contactForm.reset();
        });
    }

});
