document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MENÚ MÓVIL (HAMBURGUESA) - GLOBAL
       ========================================= */
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Solo activamos si existen los elementos (seguridad)
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Cerrar menú al dar click en un enlace
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    /* =========================================
       2. SCROLL REVEAL (ANIMACIONES) - GLOBAL
       ========================================= */
    window.addEventListener('scroll', reveal);
    
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');
        for (var i = 0; i < reveals.length; i++) {
            var windowheight = window.innerHeight;
            var revealtop = reveals[i].getBoundingClientRect().top;
            var revealpoint = 100; // Ajuste para que aparezca antes

            if (revealtop < windowheight - revealpoint) {
                reveals[i].classList.add('active');
            }
        }
    }
    // Ejecutar una vez al cargar por si ya hay elementos visibles
    reveal();


    /* =========================================
       3. LÓGICA DEL CARRUSEL (SOLO INICIO)
       ========================================= */
    const slides = document.querySelectorAll('.slide');
    
    // Verificamos si hay slides en esta página antes de ejecutar el código
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

        // Conectar botones Prev/Next desde Javascript (Más limpio que onclick en HTML)
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');

        if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

        // Iniciar
        startTimer();
    }


    /* =========================================
       4. LÓGICA DE FILTROS (SOLO TIENDA)
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Solo ejecutamos si existen botones de filtro
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Quitar clase active de todos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // 2. Activar el clickeado
                button.classList.add('active');

                const category = button.getAttribute('data-filter');

                // 3. Filtrar
                productCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        // Reiniciar animación
                        card.style.animation = 'none';
                        card.offsetHeight; /* trigger reflow */
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }


    /* =========================================
       5. CARRITO DE COMPRAS (SIMULACIÓN) - GLOBAL
       ========================================= */
    // Buscamos botones con ambas clases por compatibilidad
    const addBtns = document.querySelectorAll('.add-cart-btn, .add-btn');
    const cartBtn = document.querySelector('.cta-btn'); 
    
    let cartCount = 0;

    if (addBtns.length > 0 && cartBtn) {
        addBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                cartCount++;
                cartBtn.textContent = `Carrito (${cartCount})`;
                
                // Efecto visual
                const originalText = btn.textContent;
                btn.textContent = "¡Añadido!";
                btn.style.backgroundColor = "#c5a059";
                btn.style.color = "#ffffff";
                btn.style.borderColor = "#c5a059";

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "transparent";
                    btn.style.color = "#2c2c2c"; // O el color de texto original
                    btn.style.borderColor = "#2c2c2c";
                }, 1500);
            });
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LÓGICA DE VISTA PREVIA (MODAL) --- */
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const closeBtn = document.querySelector(".close-modal");

    // Seleccionamos tanto el botón "Vista Rápida" como la Imagen misma
    const triggers = document.querySelectorAll('.quick-view, .product-image img');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Evitamos que el clic se propague si hay otros eventos
            e.stopPropagation();

            // Encontrar la imagen correcta:
            // Si el click fue en el botón, buscamos la imagen hermana anterior.
            // Si el click fue en la imagen, usamos esa misma.
            let src = "";
            if (trigger.tagName === 'IMG') {
                src = trigger.src;
            } else {
                // Es el botón, buscamos la imagen dentro del mismo contenedor
                const container = trigger.closest('.product-image');
                const img = container.querySelector('img');
                src = img.src;
            }

            modal.style.display = "block";
            // Pequeño delay para permitir la transición de opacidad
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            modalImg.src = src;
        });
    });

    // Función para cerrar modal
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    // Cerrar con la X
    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar si dan click fuera de la imagen (en el fondo negro)
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }


    /* --- 2. LÓGICA DE BOTÓN "COMPRAR" -> MESSENGER --- */
    const buyButtons = document.querySelectorAll('.add-cart-btn'); // O la clase nueva .buy-btn

    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // ID de Facebook que me proporcionaste
            const pageID = "1601742957926368"; 
            
            // Intentamos obtener el nombre del producto para personalizar (opcional)
            const card = btn.closest('.product-card');
            const productName = card ? card.querySelector('h3').innerText : "un producto";

            // Redirigir a Messenger
            // Nota: Messenger no permite pre-llenar texto por URL de forma nativa en web,
            // pero abrirá el chat directamente con tu página.
            const url = `https://m.me/${pageID}`;
            
            window.open(url, '_blank');
        });
    });

});
/* =========================================
       EFECTO DE NIEVE (NAVIDAD) - COPOS GRANDES
       ========================================= */
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // AUMENTAMOS EL TAMAÑO AQUÍ:
        // Math.random() * 8 genera un número entre 0 y 8.
        // + 5 es el tamaño mínimo.
        // Resultado: Copos entre 5px y 13px.
        const size = Math.random() * 8 + 5 + 'px'; 
        
        snowflake.style.width = size;
        snowflake.style.height = size;
        
        // Posición horizontal aleatoria
        snowflake.style.left = Math.random() * 100 + 'vw';
        
        // Duración de la caída aleatoria
        snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';
        
        // Opacidad aleatoria
        snowflake.style.opacity = Math.random();
        
        document.body.appendChild(snowflake);
        
        // Eliminar el copo después de caer
        setTimeout(() => {
            snowflake.remove();
        }, 10000);
    }

    // Crear un copo cada 200ms
    setInterval(createSnowflake, 200);
    /* =========================================
       4. LÓGICA DE FILTROS DOBLE (CATEGORÍA + MARCA)
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brandRadios = document.querySelectorAll('input[name="brand"]');
    const productCards = document.querySelectorAll('.product-card');

    let currentCategory = 'all';
    let currentBrand = 'all';

    function filterProducts() {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardBrand = card.getAttribute('data-brand');

            // Lógica: Debe coincidir la categoría Y la marca (o ser 'all')
            const categoryMatch = (currentCategory === 'all' || cardCategory === currentCategory);
            const brandMatch = (currentBrand === 'all' || cardBrand === currentBrand);

            if (categoryMatch && brandMatch) {
                card.style.display = 'block';
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Eventos para Botones de Categoría
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.getAttribute('data-filter');
                filterProducts();
            });
        });
    }

    // Eventos para Radio Buttons de Marca
    if (brandRadios.length > 0) {
        brandRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                currentBrand = radio.value;
                filterProducts();
            });
        });
    }