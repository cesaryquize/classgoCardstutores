// Buscador simple
document.getElementById('buscador').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    alert('Buscando: ' + this.value);
  }
});

// Máquina de escribir con borrado y cambio de palabras
const palabras = [
  "Tutorías en Línea",
  "Tutorías Personalizadas",
  "Éxito Académico"
];
let palabraActual = 0;
let letraActual = 0;
let borrando = false;

function maquinaEscribir() {
  const elemento = document.getElementById('maquina-escribir');
  if (!elemento) return; 
  
  const texto = palabras[palabraActual];

  if (!borrando && letraActual <= texto.length) {
    elemento.textContent = texto.slice(0, letraActual);
    letraActual++;
    setTimeout(maquinaEscribir, 130);
  } else if (borrando && letraActual >= 0) {
    elemento.textContent = texto.slice(0, letraActual);
    letraActual--;
    setTimeout(maquinaEscribir, 70);
  } else if (!borrando) {
    borrando = true;
    setTimeout(maquinaEscribir, 1200);
  } else {
    borrando = false;
    palabraActual = (palabraActual + 1) % palabras.length;
    setTimeout(maquinaEscribir, 200);
  }
}

// --- LÓGICA DEL CARRUSEL DE TUTORES (FINAL Y RESPONSIVA) ---
function setupTutorCarousel() {
  const track = document.querySelector('.carousel-track');
  const wrapper = document.querySelector('.carousel-wrapper');
  // Si no encuentra los elementos (por ejemplo, en móvil, si se ocultan botones), sale
  if (!track || !wrapper) return; 

  const btnPrev = wrapper.querySelector('.carousel-btn.prev');
  const btnNext = wrapper.querySelector('.carousel-btn.next');
  
  const cards = Array.from(track.children);
  const cardCount = cards.length;
  if (cardCount === 0) return;

  let currentIndex = 0; 
  let isMoving = false; 
  const transitionTime = 400; 
  
  // 1. FUNCIÓN PARA CALCULAR EL PASO (Funciona en Desktop y Mobile)
  const getCardStep = () => {
    // Calcula el ancho real de la tarjeta (offsetWidth) y el margen derecho
    const card = cards[0];
    const width = card.offsetWidth;
    const style = window.getComputedStyle(card);
    const gap = parseFloat(style.marginRight) || 0;
    return width + gap;
  };

  // 2. FUNCIÓN PARA MOVER EL CARRUSEL
  const moveCarousel = (animate = true) => {
      const step = getCardStep();
      
      // Aplica la transición o la deshabilita (útil al redimensionar)
      if (animate) {
          track.style.transition = `transform ${transitionTime / 1000}s ease-in-out`;
      } else {
          track.style.transition = 'none';
      }
      
      track.style.transform = `translateX(-${currentIndex * step}px)`;
      
      // Reinicia la bandera isMoving
      if (animate) {
          setTimeout(() => { isMoving = false; }, transitionTime);
      } else {
          isMoving = false;
      }
  }

  // 3. LISTENERS
  if (btnNext) {
      btnNext.addEventListener('click', () => {
          if (isMoving) return;
          isMoving = true;
          
          if (currentIndex < cardCount - 1) {
            currentIndex++;
          } else {
            currentIndex = 0; // Loop al inicio
          }
          moveCarousel();
      });
  }

  if (btnPrev) {
      btnPrev.addEventListener('click', () => {
          if (isMoving) return;
          isMoving = true;
          
          if (currentIndex > 0) {
            currentIndex--;
          } else {
            currentIndex = cardCount - 1; // Loop al final
          }
          moveCarousel();
      });
  }
  
  // 4. SETUP INICIAL Y AJUSTE DE TAMAÑO
  moveCarousel(false); // Posicionar la primera tarjeta sin animación al cargar

  // Listener para reajustar la posición al cambiar el tamaño de la ventana
  window.addEventListener('resize', () => {
      moveCarousel(false);
  });
}

// --- Lógica del Carrusel de Imágenes CTA (NUEVA) ---
function setupCtaCarousel() {
  const carousel = document.querySelector('.cta-image-wrapper');
  if (!carousel) return; 

  const images = carousel.querySelectorAll('.cta-image-main');
  if (images.length < 2) return; 

  let currentIndex = 0;

  function rotateImages() {
    const activeIndex = currentIndex;
    const prev1Index = (currentIndex - 1 + images.length) % images.length;
    const prev2Index = (currentIndex - 2 + images.length) % images.length;

    images.forEach(img => img.classList.remove('active', 'prev1', 'prev2'));

    images[activeIndex].classList.add('active');
    images[prev1Index].classList.add('prev1');
    images[prev2Index].classList.add('prev2');

    currentIndex = (currentIndex + 1) % images.length;
  }

  rotateImages();
  setInterval(rotateImages, 3000); 
}

// --- Lógica del Carrusel de Logos ---
function setupLogoCarousel() {
  const track = document.querySelector('.logo-carousel-track');
  if (!track) return; 

  const logos = Array.from(track.children);
  const logoCount = logos.length;
  if (logoCount === 0) return;

  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const firstLogo = logos[0];

  const setupAnimation = () => {
    const logoStyle = window.getComputedStyle(firstLogo);
    const logoWidth = firstLogo.offsetWidth;
    const logoMarginLeft = parseFloat(logoStyle.marginLeft);
    const logoMarginRight = parseFloat(logoStyle.marginRight);
    const logoTotalWidth = logoWidth + logoMarginLeft + logoMarginRight;

    const totalWidth = logoTotalWidth * (logoCount * 2);
    const scrollWidth = logoTotalWidth * logoCount;
    const duration = logoCount * 2.5; 

    const animationName = 'scroll-logos';
    const keyframes = `
    @keyframes ${animationName} {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-${scrollWidth}px);
      }
    }`;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    track.style.width = `${totalWidth}px`;
    track.style.animation = `${animationName} ${duration}s linear infinite`;
  };

  if (firstLogo.complete) {
    setupAnimation();
  } else {
    firstLogo.onload = setupAnimation;
  }
}

// --- Lógica del Contador Animado ---
function setupContadores() {
  const contadorTutores = document.getElementById('contador-tutores');
  const contadorEstudiantes = document.getElementById('contador-estudiantes');
  const contadorUsuarios = document.getElementById('contador-usuario'); 
  const contadorEnplaystore = document.getElementById('contador-playstore');
  const seccion = document.querySelector('.contador-section');

  if (!seccion || !contadorTutores || !contadorEstudiantes) return;

  function animateCount(el, start, end, duration) {
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentNumber = Math.floor(progress * (end - start) + start);

      el.textContent = '+' + currentNumber;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(contadorTutores, 0, 370, 1500); 
        animateCount(contadorEstudiantes, 0, 441, 1500); 
        animateCount(contadorUsuarios, 0, 811, 1500);
        
        const animateDecimalCount = (el, start, end, duration) => {
            let startTime = null;
            const stepDecimal = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentNumber = (Math.floor(progress * (end * 10 - start * 10) + start * 10) / 10).toFixed(1);
                el.textContent = '★' + currentNumber;
                if (progress < 1) {
                    window.requestAnimationFrame(stepDecimal);
                }
            };
            window.requestAnimationFrame(stepDecimal);
        };
        animateDecimalCount(contadorEnplaystore, 0, 4.5, 1500);

        observer.unobserve(seccion);
      }
    });
  }, { threshold: 0.1 }); 

  observer.observe(seccion);
}

// --- FUNCIÓN DE ANIMACIÓN AL HACER SCROLL (PARA LAS TARJETAS) ---
function setupScrollAnimation() {
  
  const cards = document.querySelectorAll('.alianza-evento-card');
  
  if (cards.length === 0) return;

  const observerOptions = {
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  cards.forEach(card => {
    observer.observe(card);
  });
}

// --- Event Listener Principal ---
document.addEventListener('DOMContentLoaded', () => {
  maquinaEscribir();
  setupTutorCarousel(); 
  setupCtaCarousel(); 
  setupLogoCarousel();
  setupContadores();
  setupScrollAnimation(); 
});