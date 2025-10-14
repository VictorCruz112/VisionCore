document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES GENERALES ---
    const todosLosEnlaces = document.querySelectorAll('.escritorio-menu a, .Logo, .button-enlace-preview, #menu-movil a');
    const todasLasSecciones = document.querySelectorAll('.seccion-contenido');
    const botonMenuMovil = document.getElementById('menu-boton');
    const menuMovil = document.getElementById('menu-movil');
    
    // --- LÓGICA DEL MENÚ MÓVIL ---
    if (botonMenuMovil) {
        botonMenuMovil.addEventListener('click', () => {
            menuMovil.classList.toggle('menu-visible');
        });
    }

    // --- LÓGICA DE NAVEGACIÓN ENTRE SECCIONES ---
    todosLosEnlaces.forEach(enlace => {
        enlace.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = enlace.getAttribute('data-target');
            if (!targetId) return;

            const seccionObjetivo = document.getElementById(targetId);
            if (!seccionObjetivo) {
                console.error('¡Error! No se encontró la sección con el ID:', targetId);
                return;
            }

            todasLasSecciones.forEach(seccion => {
                seccion.classList.add('oculto');
            });

            seccionObjetivo.classList.remove('oculto');

            // ✅ CORRECCIÓN: Llama a la función del carrusel solo si la sección visible es Pag2
            if (targetId === 'Pag2') {
                setupCarousel();
            }

            if (menuMovil.classList.contains('menu-visible')) {
                menuMovil.classList.remove('menu-visible');
            }
            
            window.scrollTo(0, 0);
        });
    });

    // --- LÓGICA DEL CARRUSEL (AHORA DENTRO DE UNA FUNCIÓN) ---
    function setupCarousel() {
        const carruselTrack = document.querySelector('#Pag2 .carrusel-track');
        if (!carruselTrack) return; // Si no lo encuentra, no hace nada

        const slides = Array.from(carruselTrack.children);
        const nextButton = document.querySelector('#Pag2 .carrusel-boton.next');
        const prevButton = document.querySelector('#Pag2 .carrusel-boton.prev');
        const dotsNav = document.querySelector('#Pag2 .carrusel-nav');
        const dots = Array.from(dotsNav.children);

        // Ahora que la sección es visible, el ancho se calcula correctamente
        const slideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
        
        slides[0].classList.add('slide-activo'); // Asegura que el primero esté activo
        dots[0].classList.add('dot-activo');

        const moverASlide = (track, slideActual, slideObjetivo) => {
            track.style.transform = 'translateX(-' + slideObjetivo.style.left + ')';
            slideActual.classList.remove('slide-activo');
            slideObjetivo.classList.add('slide-activo');
        };

        const actualizarDots = (dotActual, dotObjetivo) => {
            dotActual.classList.remove('dot-activo');
            dotObjetivo.classList.add('dot-activo');
        };

        nextButton.addEventListener('click', () => {
            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            let siguienteSlide = slideActual.nextElementSibling;
            if (!siguienteSlide) siguienteSlide = slides[0];
            
            const indiceSiguiente = slides.findIndex(slide => slide === siguienteSlide);
            moverASlide(carruselTrack, slideActual, siguienteSlide);
            actualizarDots(dotActual, dots[indiceSiguiente]);
        });

        prevButton.addEventListener('click', () => {
            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            let anteriorSlide = slideActual.previousElementSibling;
            if (!anteriorSlide) anteriorSlide = slides[slides.length - 1];
            
            const indiceAnterior = slides.findIndex(slide => slide === anteriorSlide);
            moverASlide(carruselTrack, slideActual, anteriorSlide);
            actualizarDots(dotActual, dots[indiceAnterior]);
        });

        dotsNav.addEventListener('click', e => {
            const dotObjetivo = e.target.closest('button.carrusel-dot');
            if (!dotObjetivo) return;

            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            const indiceObjetivo = dots.findIndex(dot => dot === dotObjetivo);
            const slideObjetivo = slides[indiceObjetivo];
            
            moverASlide(carruselTrack, slideActual, slideObjetivo);
            actualizarDots(dotActual, dotObjetivo);
        });
    }
});