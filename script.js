document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA)
       ========================================= */
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    /* =========================================
       2. SCROLL REVEAL (ANIMACIONES)
       ========================================= */
    window.addEventListener('scroll', reveal);
    
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowheight = window.innerHeight;
            var revealtop = reveals[i].getBoundingClientRect().top;
            var revealpoint = 100;

            if (revealtop < windowheight - revealpoint) {
                reveals[i].classList.add('active');
            }
        }
    }
    reveal(); // Ejecutar al inicio

    /* =========================================
       3. EFECTO DE NIEVE (NAVIDAD)
       ========================================= */
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        const size = Math.random() * 8 + 5 + 'px'; 
        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';
        snowflake.style.opacity = Math.random();
        document.body.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, 10000);
    }
    // Crear nieve constantemente
    setInterval(createSnowflake, 200);

    /* =========================================
       4. LÓGICA DEL CARRUSEL (SOLO INICIO)
       ========================================= */
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        function changeSlide(n) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            resetTimer();
        }

        function autoPlay() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function startTimer() {
            slideInterval = setInterval(autoPlay, 5000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');

        if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

        startTimer();
    }

    /* =========================================
       5. LÓGICA DE FILTROS DOBLE (CATEGORÍA + MARCA)
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brandRadios = document.querySelectorAll('input[name="brand"]');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 || brandRadios.length > 0) {
        let currentCategory = 'all';
        let currentBrand = 'all';

        function filterProducts() {
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const cardBrand = card.getAttribute('data-brand');

                // Lógica: Coincidir Categoría Y Marca
                const categoryMatch = (currentCategory === 'all' || cardCategory === currentCategory);
                // Si la marca es 'all' mostramos todo, si no, debe coincidir. Si el producto no tiene marca, solo se muestra en 'all'.
                const brandMatch = (currentBrand === 'all' || (cardBrand && cardBrand === currentBrand));

                if (categoryMatch && brandMatch) {
                    card.style.display = 'block';
                    // Reiniciar animación para efecto visual
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Click en Categorías
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.getAttribute('data-filter');
                filterProducts();
            });
        });

        // Cambio en Marcas
        brandRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                currentBrand = radio.value;
                filterProducts();
            });
        });
    }

    /* =========================================
       6. CARRITO DE COMPRAS (EFECTO VISUAL)
       ========================================= */
    const addBtns = document.querySelectorAll('.add-cart-btn, .add-btn');
    const cartBtn = document.querySelector('.cta-btn'); 
    let cartCount = 0;

    if (addBtns.length > 0 && cartBtn) {
        addBtns.forEach(btn => {
            // Nota: Este evento es solo visual para el botón, 
            // no interfiere con la lógica de Messenger de abajo.
            btn.addEventListener('click', () => {
                // Solo aumentamos contador si NO es un enlace a messenger (para no confundir)
                // O podemos dejarlo como efecto divertido
                cartCount++;
                if(cartBtn) cartBtn.textContent = `Carrito (${cartCount})`;
            });
        });
    }

    /* =========================================
       7. VISTA RÁPIDA DE IMAGEN (MODAL DE FOTO)
       ========================================= */
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const closeImageModal = document.querySelector(".close-modal");
    const imgTriggers = document.querySelectorAll('.quick-view, .product-image img');

    if (imageModal && modalImg) {
        imgTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar conflictos con otros clics
                e.preventDefault(); // Evitar comportamiento default

                let src = "";
                if (trigger.tagName === 'IMG') {
                    src = trigger.src;
                } else {
                    // Es el botón, buscar la imagen vecina
                    const container = trigger.closest('.product-image');
                    const img = container.querySelector('img');
                    if (img) src = img.src;
                }

                imageModal.style.display = "block";
                setTimeout(() => { imageModal.classList.add('show'); }, 10);
                modalImg.src = src;
            });
        });

        function hideImageModal() {
            imageModal.classList.remove('show');
            setTimeout(() => { imageModal.style.display = "none"; }, 300);
        }

        if (closeImageModal) closeImageModal.addEventListener('click', hideImageModal);
        
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) hideImageModal();
        });
    }

    /* =========================================
       8. LÓGICA DE COMPRA A MESSENGER (2 PASOS SEGUROS)
       ========================================= */
    
    // -- Variables Globales del Modal de Compra --
    let mensajeParaCopiar = "";
    let datosCopiados = false; // Bandera de control
    const pageID = "859771300559984";
    
    const confirmModal = document.getElementById('modalConfirmacion');
    const btnAccion = document.getElementById('btnIrMessenger');
    const textoBtn = document.getElementById('textoBoton');
    const tituloModal = document.getElementById('tituloModal');
    const instrucciones = document.getElementById('instruccionesModal');
    const closeConfirmModal = document.querySelector("#modalConfirmacion .close-copy-modal") || document.querySelector("#modalConfirmacion span");

    // -- Función para Cerrar y Resetear --
    window.cerrarModal = function() {
        if(confirmModal) confirmModal.style.display = 'none';
        
        // Reset al estado inicial (Paso 1)
        datosCopiados = false;
        if(btnAccion) {
            btnAccion.style.backgroundColor = "#2c2c2c"; // Negro
            textoBtn.innerText = "COPIAR DATOS";
        }
        if(tituloModal) tituloModal.innerText = "Paso 1: Copiar Pedido";
        if(instrucciones) instrucciones.innerHTML = "Primero copia los detalles del producto, luego te llevaremos al chat.";
    }

    // -- Eventos de los Botones de Compra --
    const buyButtons = document.querySelectorAll('.add-cart-btn, .order-btn'); 

    if (buyButtons.length > 0 && confirmModal) {
        buyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // ¡ALTO! No ir a Messenger directo.

                // 1. Recopilar datos del producto
                const card = btn.closest('.product-card');
                
                if (card) {
                    const nombre = card.querySelector('h3') ? card.querySelector('h3').innerText.trim() : "Producto";
                    const precio = card.querySelector('.price') ? card.querySelector('.price').innerText.trim() : "A cotizar";
                    const categoria = card.querySelector('.category') ? card.querySelector('.category').innerText.trim() : "General";
                    const imgElement = card.querySelector('img');
                    const imgUrl = imgElement ? imgElement.src : "Sin foto";

                    mensajeParaCopiar = `Hola NC West Coast, me interesa:\n\n✨ ${categoria}\n📦 ${nombre}\n💲 ${precio}\n📸 Foto: ${imgUrl}\n\n¿Está disponible?`;
                } else {
                    // Botón "Cotizar" general
                    mensajeParaCopiar = "Hola NC West Coast, busco un artículo especial que no veo en la página. ¿Me pueden cotizar si les mando foto?";
                }

                // 2. Abrir la ventanita (Resetada)
                cerrarModal(); 
                confirmModal.style.display = 'flex';
            });
        });

        // -- Evento del Botón Único de la Ventana --
        if (btnAccion) {
            btnAccion.addEventListener('click', () => {
                
                if (!datosCopiados) {
                    // >>> ESTADO 1: COPIAR
                    navigator.clipboard.writeText(mensajeParaCopiar).then(() => {
                        // Éxito visual -> Pasamos al Estado 2
                        datosCopiados = true;
                        btnAccion.style.backgroundColor = "#27ae60"; // Verde
                        textoBtn.innerText = "🚀 IR A MESSENGER";
                        tituloModal.innerText = "✅ ¡Datos Copiados!";
                        instrucciones.innerHTML = "¡Listo! Ya tienes el pedido.<br>Da clic otra vez para <strong>abrir el chat y pegar</strong>.";
                    }).catch(err => {
                        console.error("Error al copiar:", err);
                        // Fallo (ej. sin HTTPS) -> Forzamos paso 2
                        datosCopiados = true;
                        textoBtn.innerText = "IR A MESSENGER";
                    });

                } else {
                    // >>> ESTADO 2: ABRIR APP
                    window.location.href = `https://m.me/${pageID}`;
                    setTimeout(cerrarModal, 2000);
                }
            });
        }

        // Cerrar al dar clic fuera
        window.onclick = function(event) {
            if (event.target == confirmModal) { cerrarModal(); }
            if (event.target == imageModal) hideImageModal();
        }
    }
});