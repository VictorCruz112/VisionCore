document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE LA PANTALLA DE BIENVENIDA MODIFICADA ---
    const splashScreen = document.getElementById('Pantalla-rapida');
    const welcomeSound = document.getElementById('Sonido-bienvenida');
    const logoYTexto = document.getElementById('Logo-y-texto'); // Contenedor clickeable
    const puertaIzquierda = document.getElementById('Izquierda');
    const puertaDerecha = document.getElementById('Derecha');

    // Función para reanudar las animaciones
    const reanudarAnimaciones = () => {
        if (logoYTexto) logoYTexto.style.animationPlayState = 'running';
        if (puertaIzquierda) puertaIzquierda.style.animationPlayState = 'running';
        if (puertaDerecha) puertaDerecha.style.animationPlayState = 'running';
    };

    if (splashScreen && logoYTexto && puertaIzquierda && puertaDerecha) {
        
        // La interacción del usuario dispara todo
        logoYTexto.addEventListener('click', (event) => {
            event.preventDefault();
            
            // 1. Intentar reproducir el audio (el clic lo permite)
            if (welcomeSound) {
                welcomeSound.play().catch(error => {
                    console.warn("La reproducción de audio fue bloqueada o falló:", error);
                });
            }
            
            // 2. Reanudar las animaciones CSS pausadas
            reanudarAnimaciones();

            // 3. Ocultar el splash screen después del tiempo total de la animación (1.7s + 2s de delay = 3.7s)
            setTimeout(() => {
                splashScreen.classList.add('splash-hidden');
            }, 3800); // 3.8 segundos para un margen de seguridad

            // 4. Deshabilitar clics futuros
            logoYTexto.style.pointerEvents = 'none';
        }, { once: true }); // El evento solo se ejecuta una vez
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
            if (menuMovil && menuMovil.classList.contains('menu-visible')) {
                menuMovil.classList.remove('menu-visible');
            }
            
            // Sube al inicio de la página
            window.scrollTo(0, 0);
        });
    });

    // --- LÓGICA DEL CARRUSEL (para la sección Pag2) ---
    function setupCarousel() {
        const carruselTrack = document.querySelector('#Pag2 .carrusel-track');
        // Prevenir errores si el carrusel ya se configuró o no existe
        if (!carruselTrack || carruselTrack.dataset.initialized) return; 

        const slides = Array.from(carruselTrack.children);
        const nextButton = document.querySelector('#Pag2 .carrusel-boton.next');
        const prevButton = document.querySelector('#Pag2 .carrusel-boton.prev');
        const dotsNav = document.querySelector('#Pag2 .carrusel-nav');
        if (!dotsNav || slides.length === 0) return; 
        const dots = Array.from(dotsNav.children);

        // Forzar recalculo del ancho del slide (crucial para responsividad)
        let slideWidth = slides[0].offsetWidth; 

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
        
        // Navegación con botón Siguiente (Usando clones para evitar listeners duplicados al re-inicializar)
        const newNextButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);
        const newPrevButton = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrevButton, prevButton);

        newNextButton.addEventListener('click', () => {
            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            let siguienteSlide = slideActual.nextElementSibling;
            if (!siguienteSlide) siguienteSlide = slides[0]; 
            
            const indiceSiguiente = slides.findIndex(slide => slide === siguienteSlide);
            moverASlide(carruselTrack, slideActual, siguienteSlide);
            actualizarDots(dotActual, dots[indiceSiguiente]);
        });

        // Navegación con botón Anterior
        newPrevButton.addEventListener('click', () => {
            const slideActual = carruselTrack.querySelector('.slide-activo');
            const dotActual = dotsNav.querySelector('.dot-activo');
            let anteriorSlide = slideActual.previousElementSibling;
            if (!anteriorSlide) anteriorSlide = slides[slides.length - 1]; 
            
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
        
        // Marca el carrusel como inicializado
        carruselTrack.dataset.initialized = 'true';

        // Manejar el cambio de tamaño de la ventana (responsividad del carrusel)
        window.addEventListener('resize', () => {
            slideWidth = slides[0].offsetWidth; // Recalcular el ancho
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
            // Mover al slide activo actual (reajusta la posición del track)
            const slideActual = carruselTrack.querySelector('.slide-activo');
            if (slideActual) {
                 carruselTrack.style.transform = 'translateX(-' + slideActual.style.left + ')';
            }
        });
    }
});