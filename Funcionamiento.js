// Espera a que todo el contenido de la página se cargue
document.addEventListener("DOMContentLoaded", function() {

    // --- LÓGICA DEL MENÚ MÓVIL (AHORA ESTÁ AQUÍ DENTRO) ---

    const botonMenu = document.getElementById('menu-boton');
    const menuMovil = document.getElementById('menu-movil');

    // Revisamos si el botón existe antes de añadirle el evento
    if (botonMenu) {
        botonMenu.addEventListener('click', () => {
            menuMovil.classList.toggle('menu-oculto');
        });
    }

    // --- LÓGICA DEL FORMULARIO (YA ESTABA AQUÍ) ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Revisamos si el formulario existe antes de añadirle el evento
    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    // Función que se ejecutará cuando se envíe el formulario
    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.innerHTML = "¡Gracias por tu mensaje! Ha sido enviado.";
                form.reset();
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    formStatus.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.innerHTML = "Oops! Hubo un problema al enviar tu formulario.";
                }
            }
        } catch (error) {
            formStatus.innerHTML = "Oops! Hubo un problema con la conexión.";
        }
    }
});
