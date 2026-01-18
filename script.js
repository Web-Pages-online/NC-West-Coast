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
    reveal();

    /* =========================================
       3. EFECTO DE NIEVE
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
        
        setTimeout(() => { snowflake.remove(); }, 10000);
    }
    setInterval(createSnowflake, 200);

    /* =========================================
       4. LÓGICA DEL CARRUSEL
       ========================================= */
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        function autoPlay() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        slideInterval = setInterval(autoPlay, 5000);

        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');

        if (prevBtn) prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            slideInterval = setInterval(autoPlay, 5000);
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            autoPlay();
            slideInterval = setInterval(autoPlay, 5000);
        });
    }

    /* =========================================
       5. LÓGICA DE FILTROS (VERSIÓN FINAL)
       ========================================= */
    const brandRadios = document.querySelectorAll('input[name="brand"]');
    let currentCategory = 'all';
    let currentBrand = 'all';

    function filterProducts() {
        const allCards = document.querySelectorAll('.product-card');
        
        allCards.forEach(card => {
            const cardCategory = (card.getAttribute('data-category') || "").toLowerCase().trim();
            const cardBrand = (card.getAttribute('data-brand') || "").toLowerCase().trim();

            const categoryMatch = (currentCategory === 'all' || cardCategory === currentCategory.toLowerCase());
            const brandMatch = (currentBrand === 'all' || cardBrand === currentBrand.toLowerCase());

            if (categoryMatch && brandMatch) {
                card.style.setProperty('display', 'block', 'important');
                card.style.animation = 'none';
                card.offsetHeight; 
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.setProperty('display', 'none', 'important');
            }
        });
    }

    // Botones de categoría
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-filter');
            filterProducts();
        });
    });

    // Radio buttons de marca
    brandRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentBrand = this.value;
            filterProducts();
        });
    });

    /* =========================================
       6. VISTA RÁPIDA (MODALES)
       ========================================= */
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const closeImageModal = document.querySelector(".close-modal");
    const imgTriggers = document.querySelectorAll('.quick-view, .product-image img');

    if (imageModal && modalImg) {
        imgTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const card = trigger.closest('.product-card');
                if(card) {
                    let src = card.querySelector('img').src;
                    imageModal.style.display = "block";
                    setTimeout(() => { imageModal.classList.add('show'); }, 10);
                    modalImg.src = src;
                }
            });
        });

        const hideModal = () => {
            imageModal.classList.remove('show');
            setTimeout(() => { imageModal.style.display = "none"; }, 300);
        };

        if (closeImageModal) closeImageModal.addEventListener('click', hideModal);
        imageModal.addEventListener('click', (e) => { if(e.target === imageModal) hideModal(); });
    }

    /* =========================================
       7. LÓGICA DE COMPRA A MESSENGER (PASOS SEGUROS)
       ========================================= */
    let mensajeParaCopiar = "";
    let datosCopiados = false;
    const pageID = "859771300559984";
    
    const confirmModal = document.getElementById('modalConfirmacion');
    const btnAccion = document.getElementById('btnIrMessenger');
    const textoBtn = document.getElementById('textoBoton');
    const tituloModal = document.getElementById('tituloModal');
    const instrucciones = document.getElementById('instruccionesModal');

    window.cerrarModal = function() {
        if(confirmModal) confirmModal.style.display = 'none';
        datosCopiados = false;
        if(btnAccion) btnAccion.style.backgroundColor = "#2c2c2c";
        if(textoBtn) textoBtn.innerText = "COPIAR DATOS";
        if(tituloModal) tituloModal.innerText = "Paso 1: Copiar Pedido";
        if(instrucciones) instrucciones.innerHTML = "Primero copia los detalles del producto, luego te llevaremos al chat.";
    };

    // Aplicar a todos los botones que inician compra
    const buyButtons = document.querySelectorAll('.add-cart-btn, .order-btn, .buy-btn'); 
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            if (card) {
                const nombre = card.querySelector('h3') ? card.querySelector('h3').innerText.trim() : "Producto";
                const precio = card.querySelector('.price') ? card.querySelector('.price').innerText.trim() : "A cotizar";
                const cat = card.querySelector('.category') ? card.querySelector('.category').innerText.trim() : "General";
                const img = card.querySelector('img') ? card.querySelector('img').src : "Sin imagen";
                
                mensajeParaCopiar = `Hola NC West Coast, me interesa:\n\n✨ ${cat}\n📦 ${nombre}\n💲 ${precio}\n📸 Foto: ${img}\n\n¿Está disponible?`;
            } else {
                mensajeParaCopiar = "Hola NC West Coast, me gustaría cotizar un artículo especial.";
            }
            confirmModal.style.display = 'flex';
        });
    });

    if (btnAccion) {
        btnAccion.addEventListener('click', () => {
            if (!datosCopiados) {
                // PASO 1: COPIAR AL PORTAPAPELES
                navigator.clipboard.writeText(mensajeParaCopiar).then(() => {
                    datosCopiados = true;
                    btnAccion.style.backgroundColor = "#27ae60"; // Cambia a verde
                    if(textoBtn) textoBtn.innerText = "🚀 IR A MESSENGER";
                    if(tituloModal) tituloModal.innerText = "✅ ¡Datos Copiados!";
                    if(instrucciones) instrucciones.innerHTML = "¡Listo! Ya tienes el pedido.<br>Da clic otra vez para <strong>abrir el chat y pegar</strong>.";
                });
            } else {
                // PASO 2: REDIRIGIR
                window.open(`https://m.me/${pageID}`, '_blank');
                cerrarModal();
            }
        });
    }

    // Cerrar modal al hacer clic fuera de la caja
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) cerrarModal();
    });
});

/* =========================================
   8. PRELOADER
   ========================================= */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }
});