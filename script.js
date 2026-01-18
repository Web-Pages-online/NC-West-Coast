/* =========================================
   SISTEMA DE CONTROL DE ERRORES (BLINDAJE)
   ========================================= */
const safeExecute = (fn) => {
    try { fn(); } catch (e) { console.warn("Módulo saltado: ", e.message); }
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. PRELOADER (Carga Segura)
    safeExecute(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => { preloader.style.display = 'none'; }, 500);
            }, 1000);
        }
    });

    // 2. MENÚ MÓVIL
    safeExecute(() => {
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        if (hamburger && navMenu) {
            hamburger.onclick = () => {
                hamburger.classList.toggle("active");
                navMenu.classList.toggle("active");
            };
        }
    });

    // 3. MOTOR DE FILTRADO (SOLUCIÓN DEFINITIVA)
    safeExecute(() => {
        let filtroCat = 'all';
        let filtroMarca = 'all';

        const aplicarFiltros = () => {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const cardCat = (card.getAttribute('data-category') || "").toLowerCase().trim();
                const cardMarca = (card.getAttribute('data-brand') || "all").toLowerCase().trim();
                
                // Mapeo flexible para categorías
                const esBag = filtroCat === 'bag' && (cardCat.includes('bolso') || cardCat.includes('sobaquera') || cardCat.includes('bag'));
                const esReloj = filtroCat === 'relojes' && cardCat.includes('reloj');
                const matchCat = (filtroCat === 'all' || cardCat === filtroCat || esBag || esReloj);
                
                // Mapeo flexible para marcas (Victoria's Secret)
                const esVS = (filtroMarca === 'victoria-secret' || filtroMarca.includes('victoria')) && (cardMarca.includes('victoria') || cardMarca === 'vs');
                const matchMarca = (filtroMarca === 'all' || cardMarca === filtroMarca || esVS);

                if (matchCat && matchMarca) {
                    card.style.setProperty('display', 'block', 'important');
                    card.style.opacity = "1";
                    card.style.visibility = "visible";
                } else {
                    card.style.setProperty('display', 'none', 'important');
                }
            });
        };

        // Click en categorías
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filtroCat = btn.getAttribute('data-filter').toLowerCase();
                aplicarFiltros();
            };
        });

        // Cambio de marcas (Radio Buttons)
        document.querySelectorAll('input[name="brand"]').forEach(radio => {
            radio.onchange = () => {
                filtroMarca = radio.value.toLowerCase();
                aplicarFiltros();
            };
        });
    });

    // 4. LÓGICA DE COMPRA (SOLO PARA PRODUCT CARDS)
    safeExecute(() => {
        const modal = document.getElementById('modalConfirmacion');
        const btnAccion = document.getElementById('btnIrMessenger');
        const tituloM = document.getElementById('tituloModal');
        const instruM = document.getElementById('instruccionesModal');
        const textoB = document.getElementById('textoBoton');
        
        let mensajeParaCopiar = "";
        let datosCopiados = false;

        window.cerrarModal = () => {
            if(modal) modal.style.display = 'none';
            datosCopiados = false;
            if(btnAccion) btnAccion.style.backgroundColor = "#2c2c2c";
            if(textoB) textoB.innerText = "COPIAR DATOS";
        };

        // Escuchador dinámico para botones de compra (Delegación de eventos)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-cart-btn, .buy-btn');
            if (btn) {
                e.preventDefault();
                const card = btn.closest('.product-card');
                if (card && modal) {
                    const nombre = card.querySelector('h3')?.innerText || "Producto";
                    const precio = card.querySelector('.price')?.innerText || "A cotizar";
                    mensajeParaCopiar = `Hola NC West Coast, me interesa:\n📦 ${nombre}\n💲 ${precio}\n\n¿Está disponible?`;
                    modal.style.display = 'flex';
                }
            }
        });

        if (btnAccion) {
            btnAccion.onclick = () => {
                if (!datosCopiados) {
                    navigator.clipboard.writeText(mensajeParaCopiar).then(() => {
                        datosCopiados = true;
                        btnAccion.style.backgroundColor = "#27ae60";
                        if(textoB) textoB.innerText = "🚀 IR A MESSENGER";
                        if(tituloM) tituloM.innerText = "✅ ¡Datos Copiados!";
                        if(instruM) instruM.innerHTML = "¡Listo! Ya tienes el pedido.<br>Da clic otra vez para abrir el chat.";
                    });
                } else {
                    window.open("https://m.me/859771300559984", "_blank");
                    cerrarModal();
                }
            };
        }
    });

    // 5. VISTA RÁPIDA (REPARADA PARA CERRAR CORRECTAMENTE - SIN NIEVE)
    safeExecute(() => {
        const imgModal = document.getElementById("imageModal");
        const modalImg = document.getElementById("img01");

        // Carrusel (si existe)
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let current = 0;
            setInterval(() => {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 5000);
        }

        // Delegación de eventos para Abrir y CERRAR
        document.addEventListener('click', (e) => {
            // --- LÓGICA PARA ABRIR ---
            const isBtn = e.target.classList.contains('quick-view');
            const isImg = e.target.classList.contains('clickable-image');

            if (isBtn || isImg) {
                const card = e.target.closest('.product-card');
                if (card && imgModal && modalImg) {
                    modalImg.src = card.querySelector('img').src;
                    imgModal.style.display = "flex"; 
                    setTimeout(() => imgModal.classList.add('show'), 20);
                }
            }

            // --- LÓGICA PARA CERRAR ---
            // Detecta si diste clic en la "X" (clase close-modal) o en el fondo oscuro del modal
            const isCloseBtn = e.target.classList.contains('close-modal');
            const isOutside = e.target === imgModal;

            if (isCloseBtn || isOutside) {
                if (imgModal) {
                    imgModal.classList.remove('show');
                    setTimeout(() => { 
                        imgModal.style.display = "none"; 
                    }, 300);
                }
            }
        });
    });

    // 6. ANIMACIONES REVEAL SCROLL
    window.onscroll = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    };
});