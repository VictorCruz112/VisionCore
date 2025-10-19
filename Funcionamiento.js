document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE LA PANTALLA DE BIENVENIDA ---
    const splashScreen = document.getElementById('Pantalla-rapida');
    const welcomeSound = document.getElementById('Sonido-bienvenida');
    const logoBienvenida = document.getElementById('logo-bienvenida');

    // Nos aseguramos de que los tres elementos existan antes de añadir el listener
    if (splashScreen && welcomeSound && logoBienvenida) {
        
        // El logo funciona como botón para iniciar el audio y la transición
        logoBienvenida.addEventListener('click', () => {

            // Iniciar el audio (la interacción del usuario lo permite)
            welcomeSound.play().catch(error => {
                console.warn("La reproducción de audio fue bloqueada, pero el usuario intentó interactuar.", error);
            });
            
            // Iniciar la animación de cierre después del delay (3.7 segundos)
            setTimeout(() => {
                splashScreen.classList.add('splash-hidden');
            }, 3700); 

            // Deshabilitar clics futuros en el logo
            logoBienvenida.style.pointerEvents = 'none';
        });
    }
    // --- FIN DE LA LÓGICA DE BIENVENIDA ---


    // --- VARIABLES GENERALES Y LÓGICA DE NAVEGACIÓN ---
    const todosLosEnlaces = document.querySelectorAll('.escritorio-menu a, .Logo, .button-enlace-preview, #menu-movil a');
    const todasLasSecciones = document.querySelectorAll('.seccion-contenido');
    const botonMenuMovil = document.getElementById('menu-boton');
    const menuMovil = document.getElementById('menu-movil');
    
    // Lógica para alternar el menú móvil
    if (botonMenuMovil) {
        botonMenuMovil.addEventListener('click', () => {
            menuMovil.classList.toggle('menu-visible');
        });
    }

    // Lógica para cambiar de sección al hacer clic en los enlaces
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

            // Oculta todas las secciones y muestra solo la objetivo
            todasLasSecciones.forEach(seccion => {
                seccion.classList.add('oculto');
            });
            seccionObjetivo.classList.remove('oculto');

            // Si es la página del proyecto (Pag2), inicializa el carrusel
            if (targetId === 'Pag2') {
                setupCarousel();
            }

            // Cierra el menú móvil si está abierto
            if (menuMovil.classList.contains('menu-visible')) {
                menuMovil.classList.remove('menu-visible');
            }
            
            // Sube al inicio de la página
            window.scrollTo(0, 0);
        });
    });

    // --- LÓGICA DEL CARRUSEL (para la sección Pag2) ---
    function setupCarousel() {
        const carruselTrack = document.querySelector('#Pag2 .carrusel-track');
        if (!carruselTrack) return; 

        const slides = Array.from(carruselTrack.children);
        const nextButton = document.querySelector('#Pag2 .carrusel-boton.next');
        const prevButton = document.querySelector('#Pag2 .carrusel-boton.prev');
        const dotsNav = document.querySelector('#Pag2 .carrusel-nav');
        if (!dotsNav) return; 
        const dots = Array.from(dotsNav.children);

        // Calcula el ancho de un slide
        const slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
        if (slideWidth === 0) return; 

        // Coloca los slides uno al lado del otro
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
        
        // Reinicializa las clases activas
        slides.forEach(s => s.classList.remove('slide-activo'));
        dots.forEach(d => d.classList.remove('dot-activo'));
        slides[0].classList.add('slide-activo');
        dots[0].classList.add('dot-activo');

        const moverASlide = (track, slideActual, slideObjetivo) => {
            if (!slideObjetivo) return;
            track.style.transform = 'translateX(-' + slideObjetivo.style.left + ')';
            slideActual.classList.remove('slide-activo');
            slideObjetivo.classList.add('slide-activo');
        };

        const actualizarDots = (dotActual, dotObjetivo) => {
            if (!dotObjetivo) return;
            dotActual.classList.remove('dot-activo');
            dotObjetivo.classList.add('dot-activo');
        };
        
        // Patrón para prevenir múltiples listeners en los botones al re-inicializar
        const newNextButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);
        const newPrevButton = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrevButton, prevButton);

        // Navegación con botón Siguiente
        newNextButton.addEventListener('click', () => {
            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            let siguienteSlide = slideActual.nextElementSibling;
            if (!siguienteSlide) siguienteSlide = slides[0]; // Bucle al inicio
            
            const indiceSiguiente = slides.findIndex(slide => slide === siguienteSlide);
            moverASlide(carruselTrack, slideActual, siguienteSlide);
            actualizarDots(dotActual, dots[indiceSiguiente]);
        });

        // Navegación con botón Anterior
        newPrevButton.addEventListener('click', () => {
            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            let anteriorSlide = slideActual.previousElementSibling;
            if (!anteriorSlide) anteriorSlide = slides[slides.length - 1]; // Bucle al final
            
            const indiceAnterior = slides.findIndex(slide => slide === anteriorSlide);
            moverASlide(carruselTrack, slideActual, anteriorSlide);
            actualizarDots(dotActual, dots[indiceAnterior]);
        });

        // Navegación con los puntos (dots)
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