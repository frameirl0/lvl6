document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initNavScroll();
    initActiveNav();
    initDropdownMenu();
    initPricingSelection();
    initForm();
});


// ── NAVBAR SCROLL EFFECT ──────────────────────
function initNavScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    });
}


// ── ACTIVE NAV LINK ON SCROLL ─────────────────
function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length) return;


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { threshold: 0.35 });


    sections.forEach(section => observer.observe(section));
}


// ── DROPDOWN MENU ─────────────────────────────
function initDropdownMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const dropdownMenu = document.getElementById("dropdown-menu");
    if (!menuToggle || !dropdownMenu) return;


    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });
    window.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && e.target !== menuToggle) {
            dropdownMenu.classList.remove("show");
        }
    });
}


// ── PLAN CARD SELECTION ───────────────────────
function initPricingSelection() {
    const planCards = document.querySelectorAll(".plan-card");
    const selectedText = document.getElementById("selected-plan-text");
    const planSelect = document.getElementById("plan");


    planCards.forEach(card => {
        card.addEventListener("click", () => {
            planCards.forEach(p => p.classList.remove("active"));
            card.classList.add("active");
            const planName = card.dataset.plan;
            if (selectedText) {
                selectedText.textContent = `✓ ${planName} plan selected — scroll down to book`;
            }
            if (planSelect) planSelect.value = planName;
            // Smooth scroll to booking
            setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        });
    });
}


// ── SELECT PLAN (from button) ─────────────────
function selectPlan(planName) {
    const planCards = document.querySelectorAll(".plan-card");
    planCards.forEach(p => {
        p.classList.toggle("active", p.dataset.plan === planName);
    });
    const planSelect = document.getElementById("plan");
    if (planSelect) planSelect.value = planName;
    const selectedText = document.getElementById("selected-plan-text");
    if (selectedText) selectedText.textContent = `✓ ${planName} plan selected`;
}


// ── BOOKING FORM ──────────────────────────────
function initForm() {
    const form = document.getElementById("booking-form");
    if (!form) return;


    form.addEventListener("submit", function (e) {
        e.preventDefault();


        const name  = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const plan  = document.getElementById("plan")?.value;


        if (!name || !email || !plan) {
            showMessage("Please complete all required fields.", "error");
            return;
        }
        if (!validateEmail(email)) {
            showMessage("Please enter a valid email address.", "error");
            return;
        }


        const booking = {
            name, email, phone, plan,
            date: new Date().toLocaleString("en-PH")
        };


        try {
            let bookings = JSON.parse(localStorage.getItem("lvl6_bookings") || "[]");
            bookings.push(booking);
            localStorage.setItem("lvl6_bookings", JSON.stringify(bookings));
        } catch (err) {
            console.warn("LocalStorage unavailable:", err);
        }


        showMessage(`🎉 Booking received, ${name}! We'll confirm via email within 24 hours.`, "success");
        form.reset();
        document.getElementById("selected-plan-text").textContent = "";
        document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("active"));
    });
}


// ── AUTH ──────────────────────────────────────
function initAuth() {
    const loginBtn    = document.getElementById("login-btn");
    const logoutBtn   = document.getElementById("logout-btn");
    const bookingForm = document.getElementById("booking-form");
    const logoutLink  = document.getElementById("logout-link");


    function updateAuthUI() {
        const isLoggedIn = localStorage.getItem("lvl6_loggedIn") === "true";
        if (loginBtn)    loginBtn.style.display    = isLoggedIn ? "none" : "inline-flex";
        if (logoutBtn)   logoutBtn.style.display   = isLoggedIn ? "inline-flex" : "none";
        if (bookingForm) bookingForm.style.display  = isLoggedIn ? "flex" : "none";
    }


    loginBtn?.addEventListener("click", () => {
        localStorage.setItem("lvl6_loggedIn", "true");
        updateAuthUI();
    });
    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("lvl6_loggedIn");
        updateAuthUI();
    });
    logoutLink?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("lvl6_loggedIn");
        updateAuthUI();
        document.getElementById("dropdown-menu")?.classList.remove("show");
    });


    updateAuthUI();
}


// ── HELPERS ───────────────────────────────────
function showMessage(text, type) {
    const msg = document.getElementById("form-message");
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = type === "error" ? "#ff6b6b" : "#4ade80";
    clearTimeout(msg._timer);
    msg._timer = setTimeout(() => { msg.textContent = ""; }, 5000);
}


function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}




