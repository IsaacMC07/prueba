
// ----------------------------------------------
// 1. CONFIGURACIÓN DEL TEMPORIZADOR
// ----------------------------------------------
let timeLeft = 300; // 5 minutos
let timerInterval = null;
let registered = false;
let expiredTriggered = false;

const timerDisplaySpan = document.getElementById('timerDisplay');
const activeFormContainer = document.getElementById('activeFormContainer');
const expiredMessageDiv = document.getElementById('expiredMessage');
const successMessageDiv = document.getElementById('successMessage');
const registerForm = document.getElementById('registerForm');
const nombreInput = document.getElementById('nombre');
const correoInput = document.getElementById('correo');
const mensajeInput = document.getElementById('mensaje');

function updateTimerUI() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timerDisplaySpan) timerDisplaySpan.innerText = formattedTime;
}

async function handleRegisterSubmit(e) {
    if (registered || expiredTriggered) return;
    expiredTriggered = true;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (activeFormContainer) activeFormContainer.classList.add('hidden');
    if (expiredMessageDiv) expiredMessageDiv.classList.remove('hidden');
    if (successMessageDiv) successMessageDiv.classList.add('hidden');
}

function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (registered) {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
            return;
        }
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            handleExpiration();
        } else {
            timeLeft--;
            updateTimerUI();
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                handleExpiration();
            }
        }
    }, 1000);
}

function registerSuccess() {
    if (registered || expiredTriggered) return;
    registered = true;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (activeFormContainer) activeFormContainer.classList.add('hidden');
    if (successMessageDiv) successMessageDiv.classList.remove('hidden');
    if (expiredMessageDiv) expiredMessageDiv.classList.add('hidden');
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    if (expiredTriggered) {
        alert("El tiempo de registro ya expiró. No puedes registrarte.");
        return;
    }
    if (registered) {
        alert("Ya estás registrado en el Hackathon. ¡Nos vemos!");
        return;
    }

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const mensaje = mensajeInput.value.trim();

    if (nombre === "") {
        alert("Por favor, ingresa tu nombre completo.");
        return;
    }
    if (correo === "") {
        alert("El correo electrónico es obligatorio.");
        return;
    }
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        alert("Ingresa un correo electrónico válido (ejemplo: nombre@dominio.com).");
        return;
    }
    if (mensaje === "") {
        alert("Escribe un breve mensaje o cuéntanos tu motivación.");
        return;
    }
    //bd
    try {
        const res = await fetch('https://https://prueba-production-5619.up.railway.app/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, mensaje })
        });
    
        const data = await res.json();
    
        if (res.ok) {
            registerSuccess(); // ahora solo se llama si el backend dijo que sí
        } else {
            alert(data.error || 'Error al registrar');
        }
    } catch (err) {
        alert('No se pudo conectar con el servidor');
    }
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterSubmit);
}

startCountdown();

// -------------------------------------------------------
// 2. SCROLL REVEAL para las tarjetas de información
// -------------------------------------------------------
const cardsToReveal = document.querySelectorAll('.reveal-card');

const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -20px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

cardsToReveal.forEach(card => {
    revealObserver.observe(card);
});

window.addEventListener('load', () => {
    cardsToReveal.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            card.classList.add('revealed');
        }
    });
});

// -------------------------------------------------------
// 3. CARRUSEL DE IMÁGENES 
// -------------------------------------------------------

const imageUrls = [
    "/src/foto1.jpg",
    "/src/foto2.jpg",
    "/src/foto3.jpg",
    "/src/foto4.jpeg"
];
// =================================================

let currentSlide = 0;
let totalSlides = imageUrls.length;
const carouselTrack = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('dotsContainer');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function buildCarousel() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    imageUrls.forEach((url, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('carousel-slide');
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Imagen del Hackathon ${idx+1}`;
        img.loading = "lazy";
        slideDiv.appendChild(img);
        carouselTrack.appendChild(slideDiv);
        
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(idx);
        });
        dotsContainer.appendChild(dot);
    });
    totalSlides = imageUrls.length;
    updateCarouselPosition();
}

function updateCarouselPosition() {
    if (!carouselTrack) return;
    const newTransform = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${newTransform}%)`;
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if (idx === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentSlide = index;
    updateCarouselPosition();
}

function nextSlide() {
    if (currentSlide + 1 < totalSlides) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateCarouselPosition();
}

function prevSlide() {
    if (currentSlide - 1 >= 0) {
        currentSlide--;
    } else {
        currentSlide = totalSlides - 1;
    }
    updateCarouselPosition();
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateCarouselPosition();
    }, 150);
});

if (imageUrls.length > 0) {
    buildCarousel();
} else {
    if(carouselTrack) carouselTrack.innerHTML = '<div class="carousel-slide" style="text-align:center;padding:3rem;">📷 Sube tus imágenes en el array imageUrls</div>';
}

window.addEventListener('load', () => {
    if (imageUrls.length) updateCarouselPosition();
});

console.log("Landing page lista · Hackathon rojo-rosado · temporizador 5 minutos | Scroll reveal | Carrusel editable");