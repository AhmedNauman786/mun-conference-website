/* ============================================
   MODEL UNITED NATIONS - Interactive Scripts
   Smooth animations, form handling, particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initParticles();
    initRevealAnimations();
    initCounters();
    initSmoothScroll();
    initForm();
    initModal();
    initBackToTop();
    initMobileMenu();
    initCommitteeCards();
    initEventButtons();
});

/* ========== NAVBAR ========== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ========== PARTICLE BACKGROUND ========== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary check
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (dx / distance) * force * 1.5;
                    this.y -= (dy / distance) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    window.addEventListener('resize', () => {
        createParticles();
    });
}

/* ========== REVEAL ON SCROLL ========== */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ========== ANIMATED COUNTERS ========== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    update();
}

/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });

                // Close mobile menu if open
                const navLinks = document.getElementById('nav-links');
                const hamburger = document.getElementById('hamburger');
                if (navLinks && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

/* ========== FORM HANDLING ========== */
function initForm() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation
        const fullname = form.fullname.value.trim();
        const email = form.email.value.trim();
        const country = form.country.value.trim();
        const experience = form.experience.value;
        const committee = form.committee.value;

        if (!fullname || !email || !country || !experience || !committee) {
            shakeForm(form);
            return;
        }

        // Simulate submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.classList.add('hidden');
            form.style.display = 'none';
            document.getElementById('form-success').classList.remove('hidden');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // Input focus animations
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

function shakeForm(form) {
    form.style.animation = 'none';
    form.offsetHeight; // trigger reflow
    form.style.animation = 'shake 0.5s ease';
}

// Add shake keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-8px); }
        40%, 80% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);

function resetForm() {
    const form = document.getElementById('registration-form');
    const success = document.getElementById('form-success');
    form.reset();
    form.style.display = 'flex';
    form.classList.remove('hidden');
    success.classList.add('hidden');
}

/* ========== MODAL ========== */
function initModal() {
    const modal = document.getElementById('committee-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(content) {
    const modal = document.getElementById('committee-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('committee-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ========== COMMITTEE CARDS ========== */
function initCommitteeCards() {
    const committeeData = {
        ga: {
            title: 'General Assembly',
            icon: 'fa-landmark',
            description: 'The General Assembly is the main deliberative organ of the United Nations. In our simulation, you will represent a member state and debate critical global issues with hundreds of fellow delegates.',
            details: [
                'Topics cover the full spectrum of international affairs',
                'Rules of procedure closely mirror real UN practices',
                'Ideal for first-time and experienced delegates alike',
                'Opportunities for both formal debate and informal caucusing'
            ]
        },
        sc: {
            title: 'Security Council',
            icon: 'fa-balance-scale',
            description: 'As a member of the Security Council, you hold extraordinary power. Navigate geopolitical tensions, draft binding resolutions, and decide the fate of international peace and security.',
            details: [
                'Only 15 members — intense, high-stakes debate',
                'Veto power for permanent members (P5)',
                'Rapidly evolving crisis elements often included',
                'Requires strong research and diplomatic skill'
            ]
        },
        ecosoc: {
            title: 'ECOSOC',
            icon: 'fa-chart-line',
            description: 'The Economic and Social Council focuses on global economic, social, and environmental challenges. Shape the future of sustainable development and international cooperation.',
            details: [
                'Deep dive into policy and development issues',
                'Collaboration with specialized agencies',
                'Focus on practical, implementable solutions',
                'Great for delegates interested in economics & policy'
            ]
        },
        crisis: {
            title: 'Crisis Committees',
            icon: 'fa-bolt',
            description: 'Crisis committees throw you into dynamic, fast-moving scenarios. Whether historical or speculative, you will respond to real-time updates with directives, communiqués, and creative strategy.',
            details: [
                'Continuous crisis updates from the backroom',
                'Individual portfolio powers and dual roles',
                'Emphasis on creativity and quick thinking',
                'Often joint crisis with multiple interconnected committees'
            ]
        }
    };

    document.querySelectorAll('.committee-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-committee');
            const data = committeeData[key];
            if (!data) return;

            const content = `
                <div style="text-align:center; margin-bottom:24px;">
                    <div style="width:70px;height:70px;background:rgba(99,102,241,0.15);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.8rem;color:#818cf8;">
                        <i class="fas ${data.icon}"></i>
                    </div>
                    <h2 style="font-size:1.6rem;margin-bottom:12px;">${data.title}</h2>
                </div>
                <p style="color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px;">${data.description}</p>
                <ul style="list-style:none;margin-bottom:28px;">
                    ${data.details.map(d => `<li style="padding:8px 0;padding-left:20px;position:relative;color:rgba(255,255,255,0.6);font-size:0.95rem;">
                        <span style="position:absolute;left:0;color:#6366f1;">▸</span> ${d}
                    </li>`).join('')}
                </ul>
                <button onclick="scrollToSection('join'); closeModal();" class="btn btn-primary full-width" style="margin-top:8px;">
                    <span>Register for this Committee</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            `;
            openModal(content);
        });
    });
}

/* ========== EVENT BUTTONS ========== */
function initEventButtons() {
    document.querySelectorAll('.event-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            scrollToSection('join');
            // Optional: pre-select something or show a toast
            showToast('Scroll down to complete your registration!');
        });
    });
}

function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(99, 102, 241, 0.95);
        color: white;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 3000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

/* ========== BACK TO TOP ========== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
}

/* Make functions available globally for inline handlers */
window.scrollToSection = scrollToSection;
window.resetForm = resetForm;
window.closeModal = closeModal;
