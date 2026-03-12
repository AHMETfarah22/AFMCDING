// Enhanced JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);

    // Cursor Effects
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'light';
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    // Navbar scroll effect
    const navbar = document.getElementById("navbar");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinkItems = document.querySelectorAll(".nav-link");
    navLinkItems.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinkItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });

    // Typewriter Effect
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

            let typeSpeed = 100;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Init TypeWriter
    const initTypeWriter = () => {
        const txtElement = document.querySelector('.typed-text');
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    };

    // Set typewriter words
    const typedText = document.querySelector('.typed-text');
    if (typedText) {
        typedText.setAttribute('data-words', JSON.stringify([
            'Full-Stack Developer',
            'Logo Designer', 
            'Data Analyst',
            'UI/UX Designer',
            'Problem Solver'
        ]));
        typedText.setAttribute('data-wait', '2000');
        initTypeWriter();
    }

    // Animated Counter
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const startCounter = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-count');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Skills Progress Animation
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                if (entry.target.classList.contains('stat-number')) {
                    startCounter();
                }
                
                if (entry.target.classList.contains('skills-content')) {
                    animateSkills();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-card, .service-card, .project-card, .skill-item, .about-content, .skills-content').forEach(el => {
        observer.observe(el);
    });

    // Particles.js Background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#3b82f6" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#3b82f6",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }

    // Skills Category Switching
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillsGrids = document.querySelectorAll('.skills-grid');
    
    skillCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            
            // Update active category
            skillCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Show corresponding skills
            skillsGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === categoryId) {
                    grid.classList.add('active');
                }
            });
        });
    });

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Form Submission with Validation
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Basic validation
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const formData = {
            name: name,
            email: email,
            subject: subject,
            message: message,
        };

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            const res = await fetch('https://formspree.io/f/mleypwnq', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showNotification('Thank you for your message! It has been sent successfully.', 'success');
                contactForm.reset();
            } else {
                const data = await res.json();
                showNotification(data.errors?.[0]?.message || 'Failed to send message.', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('Server error occurred while sending message.', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface-elevated);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-xl);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 10000;
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid var(--color-success);
        }
        
        .notification.error {
            border-left: 4px solid var(--color-error);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification.success i {
            color: var(--color-success);
        }
        
        .notification.error i {
            color: var(--color-error);
        }
    `;
    document.head.appendChild(notificationStyles);

    // Image lazy loading
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.classList.contains('lazy')) {
            imageObserver.observe(img);
        }
    });

    // Add some performance optimizations
    window.addEventListener('load', () => {
        // Remove preloader
        preloader.classList.add('loaded');
        
        // Initialize animations after load
        setTimeout(() => {
            animateSkills();
        }, 500);
    });

    // Add resize handler for responsive adjustments
    window.addEventListener('resize', () => {
        // Recalculate any responsive elements if needed
    });
});
// Enhanced Project Filtering and Load More
function initializeProjects() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const loadMoreBtn = document.getElementById('loadMoreProjects');
    let visibleProjects = 6; // Initial visible projects
    const projectsPerLoad = 3;

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category').split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow && index < visibleProjects) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            // Reset visible projects count when filtering
            visibleProjects = 6;
            updateLoadMoreButton();
        });
    });

    // Load More functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleProjects += projectsPerLoad;
            showProjects();
            updateLoadMoreButton();
        });
    }

    function showProjects() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        projectCards.forEach((card, index) => {
            const categories = card.getAttribute('data-category').split(' ');
            const shouldShow = activeFilter === 'all' || categories.includes(activeFilter);
            
            if (shouldShow && index < visibleProjects) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('new');
                    setTimeout(() => {
                        card.classList.remove('new');
                    }, 600);
                }, index * 100);
            } else if (shouldShow && index >= visibleProjects) {
                card.style.display = 'none';
            }
        });
    }

    function updateLoadMoreButton() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const totalFilteredProjects = Array.from(projectCards).filter(card => {
            const categories = card.getAttribute('data-category').split(' ');
            return activeFilter === 'all' || categories.includes(activeFilter);
        }).length;

        if (visibleProjects >= totalFilteredProjects) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    // Initialize
    showProjects();
    updateLoadMoreButton();
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProjects);

// Enhanced Skills Functionality
function initializeSkills() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillsGrids = document.querySelectorAll('.skills-grid');
    const skillProgresses = document.querySelectorAll('.skill-progress');

    // Category switching
    skillCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            
            // Update active category
            skillCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Show corresponding skills
            skillsGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.id === categoryId) {
                    grid.classList.add('active');
                    // Animate skill bars when category becomes active
                    setTimeout(() => animateSkillBars(grid), 300);
                }
            });
        });
    });

    // Animate skill bars
    function animateSkillBars(container) {
        const progressBars = container.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 100);
        });
    }

    // Intersection Observer for initial animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeGrid = document.querySelector('.skills-grid.active');
                if (activeGrid) {
                    animateSkillBars(activeGrid);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(document.querySelector('.skills'));

    // Initialize first category animation
    setTimeout(() => {
        const activeGrid = document.querySelector('.skills-grid.active');
        if (activeGrid) {
            animateSkillBars(activeGrid);
        }
    }, 1000);
}

// Initialize skills when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSkills);

// End of script
