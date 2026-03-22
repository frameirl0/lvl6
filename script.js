document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavScroll();
    initActiveNav();
    initMobileMenu();
    initLoginModal();
    initForm();
    initTutorial();
});

function initNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
}

function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(section => observer.observe(section));
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    });
    function closeMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }
    mobileClose?.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function initLoginModal() {
    const trigger = document.getElementById('login-trigger');
    const overlay = document.getElementById('login-overlay');
    const modalClose = document.getElementById('modal-close');
    const loginForm = document.getElementById('login-form');
    const loginSuccess = document.getElementById('login-success');

    trigger?.addEventListener('click', () => {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    });

    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeLogin();
    });

    modalClose?.addEventListener('click', closeLogin);

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();
        if (!user || !pass) return;
        loginForm.classList.add('hide');
        loginSuccess.classList.add('show');
        trigger.classList.add('logged-in');
        lucide.createIcons();
    });
}

function closeLogin() {
    const overlay = document.getElementById('login-overlay');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
}

let tutCurrentStep = 0;
const tutTotal = 4;

function initTutorial() {
    updateTutorial();
}

function tutNext() {
    if (tutCurrentStep < tutTotal - 1) {
        tutCurrentStep++;
        updateTutorial();
    }
}

function tutPrev() {
    if (tutCurrentStep > 0) {
        tutCurrentStep--;
        updateTutorial();
    }
}

function tutGo(index) {
    tutCurrentStep = index;
    updateTutorial();
}

function updateTutorial() {
    document.querySelectorAll('.tut-step').forEach((el, i) => {
        el.classList.toggle('active', i === tutCurrentStep);
    });
    document.querySelectorAll('.tut-dot-nav').forEach((el, i) => {
        el.classList.toggle('active', i === tutCurrentStep);
    });
    document.querySelectorAll('.tut-sidebar-step').forEach((el, i) => {
        el.classList.toggle('active', i === tutCurrentStep);
    });
    const prevBtn = document.getElementById('tut-prev');
    const nextBtn = document.getElementById('tut-next');
    if (prevBtn) prevBtn.disabled = tutCurrentStep === 0;
    if (nextBtn) nextBtn.disabled = tutCurrentStep === tutTotal - 1;
    lucide.createIcons();
}

function choosePlan(planName) {
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.plan === planName);
    });
    const planSelect = document.getElementById('plan');
    if (planSelect) planSelect.value = planName;
    setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
}

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

function initForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name  = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const plan  = document.getElementById('plan')?.value;
        if (!name || !email) {
            showMessage('Please fill in your name and email.', 'error');
            return;
        }
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        const booking = { name, email, phone, plan, date: new Date().toLocaleString('en-PH') };
        try {
            let bookings = JSON.parse(localStorage.getItem('lvl6_bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('lvl6_bookings', JSON.stringify(bookings));
        } catch(err) {}
        showMessage('🎉 Booking received, ' + name + '! We will confirm within 24 hours.', 'success');
        form.reset();
        document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    });
}

function showMessage(text, type) {
    const msg = document.getElementById('form-message');
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = type === 'error' ? '#ff6b6b' : '#4ade80';
    clearTimeout(msg._timer);
    msg._timer = setTimeout(() => { msg.textContent = ''; }, 6000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
