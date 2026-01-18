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

        // Solo captura botones DENTRO de las tarjetas de producto
        document.querySelectorAll('.product-card .add-cart-btn, .product-card .buy-btn, .product-card .order-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const card = btn.closest('.product-card');
                if (card && modal) {
                    const nombre = card.querySelector('h3')?.innerText || "Producto";
                    const precio = card.querySelector('.price')?.innerText || "A cotizar";
                    mensajeParaCopiar = `Hola NC West Coast, me interesa:\n📦 ${nombre}\n💲 ${precio}\n\n¿Está disponible?`;
                    modal.style.display = 'flex';
                }
            };
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

    // 5. CARRUSEL, NIEVE Y VISTA RÁPIDA (Protegidos)
    safeExecute(() => {
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let current = 0;
            setInterval(() => {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 5000);
        }
        
        const imgModal = document.getElementById("imageModal");
        const modalImg = document.getElementById("img01");
        if (imgModal && modalImg) {
            document.querySelectorAll('.quick-view, .product-image img').forEach(trigger => {
                trigger.onclick = () => {
                    const card = trigger.closest('.product-card');
                    if (card) {
                        modalImg.src = card.querySelector('img').src;
                        imgModal.style.display = "block";
                        setTimeout(() => imgModal.classList.add('show'), 10);
                    }
                };
            });
        }
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