document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE LA PANTALLA DE BIENVENIDA (MODIFICADA) ---
    const splashScreen = document.getElementById('Pantalla-rapida');
    const welcomeSound = document.getElementById('Sonido-bienvenida');
    const logoYTexto = document.getElementById('Logo-y-texto'); // Contenedor clickeable
    const puertaIzquierda = document.getElementById('Izquierda');
    const puertaDerecha = document.getElementById('Derecha');

    // Esta función ya no es necesaria para la secuencia principal, 
    // pero la mantenemos por si se usa en otro lado.
    const reanudarAnimaciones = () => {
        if (logoYTexto) logoYTexto.style.animationPlayState = 'running';
        if (puertaIzquierda) puertaIzquierda.style.animationPlayState = 'running';
        if (puertaDerecha) puertaDerecha.style.animationPlayState = 'running';
    };

    if (splashScreen && logoYTexto && puertaIzquierda && puertaDerecha) {
        
        logoYTexto.addEventListener('click', (event) => {
            event.preventDefault();
            
            // 1. Reproduce el sonido (si existe)
            if (welcomeSound) {
                welcomeSound.play().catch(error => {
                    console.warn("La reproducción de audio fue bloqueada o falló:", error);
                });
            }
            
            // 2. Deshabilita más clics
            logoYTexto.style.pointerEvents = 'none';

            // 3. Añade la clase para que el logo desaparezca (animación de 0.5s)
            //    (Esta clase .logo-oculto debe estar en Diseño.css)
            logoYTexto.classList.add('logo-oculto');
            
            // 4. Espera a que termine la animación del logo (500ms = 0.5s)
            setTimeout(() => {
                // 5. Inicia la animación de las puertas
                if (puertaIzquierda) puertaIzquierda.style.animationPlayState = 'running';
                if (puertaDerecha) puertaDerecha.style.animationPlayState = 'running';
            }, 500); // <-- Coincide con la duración de 'logo-oculto'

            // 6. Oculta la pantalla splash DESPUÉS de que todo termine
            //    Tiempo total = 500ms (logo) + 1700ms (puertas) = 2200ms
            setTimeout(() => {
                splashScreen.classList.add('splash-hidden');
            }, 2200); // 500ms (fundido logo) + 1700ms (apertura puertas)

        }, { once: true });
    }
    // ------------------------------------------------------------------


    // --- LÓGICA DEL FORMULARIO DE CONTACTO (SIN CAMBIOS) ---
    const formulario = document.querySelector('.formulario');
    
    if (formulario) {
        formulario.addEventListener('submit', async function (event) {
            event.preventDefault(); // Detiene el envío normal del formulario

            const form = event.target;
            const statusMessage = document.createElement('div');
            statusMessage.style.cssText = 'padding: 1rem; margin-top: 1.5rem; border-radius: 5px; text-align: center; font-weight: bold;';

            // Muestra un mensaje de carga temporalmente
            const boton = form.querySelector('.boton-grande');
            const textoOriginalBoton = boton.textContent;
            boton.disabled = true;
            boton.textContent = 'Enviando...';
            
            try {
                // Utiliza la API fetch para enviar los datos de forma asíncrona
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Éxito: Muestra el mensaje de confirmación
                    statusMessage.textContent = "Tu mensaje ha sido enviado con éxito. ✅";
                    statusMessage.style.backgroundColor = '#d4edda'; // Verde claro
                    statusMessage.style.color = '#155724'; // Verde oscuro

                    form.reset(); // Limpia el formulario
                    
                } else {
                    // Fallo en la respuesta del servidor o Formspree
                    statusMessage.textContent = "Hubo un error al enviar el mensaje. ❌";
                    statusMessage.style.backgroundColor = '#f8d7da'; // Rojo claro
                    statusMessage.style.color = '#721c24'; // Rojo oscuro
                }

            } catch (error) {
                // Fallo en la conexión de red
                console.error('Error de red:', error);
                statusMessage.textContent = "Error de conexión. Intenta de nuevo más tarde. 🌐";
                statusMessage.style.backgroundColor = '#fff3cd'; // Amarillo claro
                statusMessage.style.color = '#856404'; // Amarillo oscuro
            } finally {
                // Vuelve a habilitar el botón y muestra el estado
                boton.disabled = false;
                boton.textContent = textoOriginalBoton;

                // Añade el mensaje de estado justo debajo del formulario
                form.appendChild(statusMessage);

                // Oculta el mensaje de estado después de 5 segundos
                setTimeout(() => {
                    statusMessage.remove();
                }, 5000);
            }
        });
    }



    // --- VARIABLES GENERALES Y LÓGICA DE NAVEGACIÓN--
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

    // --- LÓGICA DEL CARRUSEL () ---
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

        let slideWidth = slides[0].offsetWidth; 

        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
        
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

        newPrevButton.addEventListener('click', () => {
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
        
        carruselTrack.dataset.initialized = 'true';

        window.addEventListener('resize', () => {
            slideWidth = slides[0].offsetWidth; 
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
            const slideActual = carruselTrack.querySelector('.slide-activo');
            if (slideActual) {
                 carruselTrack.style.transform = 'translateX(-' + slideActual.style.left + ')';
            }
        });
    }
});

