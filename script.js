// ---- THEME TOGGLE ----
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Cargar preferencia guardada
const saved = localStorage.getItem('theme') || 'light';
if (saved === 'dark') {
    html.classList.add('dark');
    themeToggle.checked = true; // sincroniza el checkbox visualmente
}

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});

// ---- HAMBURGUESA MENU ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    navMenu.style.right = '-100%';
}

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
        closeMenu();
    } else {
        hamburger.classList.add('active');
        navMenu.classList.add('open');
        navMenu.style.display = 'flex';
        navMenu.style.right = '0';
    }
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
    }
});

// ---- NAVIGATION ----
const navLinks = document.querySelectorAll('.nav-link');
const screens = document.querySelectorAll('.screen');

function navigateTo(targetId) {
    screens.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if (activeLink) activeLink.classList.add('active');

    closeMenu(); // para cerrarlo aut.

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute('data-target'));
    });
});

// ---- HEADER SCROLL ----
window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('shadow-lg', window.pageYOffset > 50);
});

// ---- BARRA DE PROGRESO ----
const progressFill = document.getElementById('progressFill');
const progressPercText = document.getElementById('progressPercText');
const QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

function updateProgress() {
    const answered = QUESTIONS.filter(q => document.querySelector(`input[name="${q}"]:checked`)).length;
    const pct = Math.round((answered / QUESTIONS.length) * 100);
    progressFill.style.width = pct + '%';
    progressPercText.textContent = pct + '%';
}

document.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener('change', updateProgress);
});

// ---- FORM SUBMIT ----
document.getElementById('vocationalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const unanswered = QUESTIONS.filter(q => !document.querySelector(`input[name="${q}"]:checked`));
    if (unanswered.length > 0) {
        alert(`Por favor responde todas las preguntas. Te faltan ${unanswered.length} pregunta(s).`);
        return;
    }
    navigateTo('resultados');
});