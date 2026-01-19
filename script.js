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
                
                const esBag = filtroCat === 'bag' && (cardCat.includes('bolso') || cardCat.includes('sobaquera') || cardCat.includes('bag'));
                const esReloj = filtroCat === 'relojes' && cardCat.includes('reloj');
                const matchCat = (filtroCat === 'all' || cardCat === filtroCat || esBag || esReloj);
                
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

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filtroCat = btn.getAttribute('data-filter').toLowerCase();
                aplicarFiltros();
            };
        });

        document.querySelectorAll('input[name="brand"]').forEach(radio => {
            radio.onchange = () => {
                filtroMarca = radio.value.toLowerCase();
                aplicarFiltros();
            };
        });
    });

    // 4. LÓGICA DE COMPRA (MENSAJE DETALLADO ESTILO IMAGEN)
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
            if(tituloM) tituloM.innerText = "Paso 1: Copiar Pedido";
            if(instruM) instruM.innerHTML = "Primero copia los detalles del producto, luego te llevaremos al chat.";
        };

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-cart-btn, .buy-btn');
            if (btn) {
                e.preventDefault();
                const card = btn.closest('.product-card');
                if (card && modal) {
                    const categoria = card.querySelector('.category')?.innerText || "General";
                    const nombre = card.querySelector('h3')?.innerText || "Producto";
                    const precio = card.querySelector('.price')?.innerText || "A cotizar";
                    const imagenLink = card.querySelector('img')?.src;

                    mensajeParaCopiar = `Hola NC West Coast, me interesa:\n\n✨ Tipo: ${categoria.toUpperCase()}\n📦 Modelo: ${nombre}\n💰 Precio: ${precio}\n📸 Ref: ${imagenLink}\n\n¿Está disponible?`;
                    
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

    // 5. VISTA RÁPIDA UNIVERSAL (PRODUCTOS Y COLLAGES)
    safeExecute(() => {
        const imgModal = document.getElementById("imageModal");
        const modalImg = document.getElementById("img01");

        // Carrusel automático
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            let current = 0;
            setInterval(() => {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 5000);
        }

        // Delegación de eventos para Abrir y Cerrar Imagen
        document.addEventListener('click', (e) => {
            // DETECTAR APERTURA: Botón de vista rápida, clase clickable-image o imágenes en collage-grid
            const isQuickView = e.target.classList.contains('quick-view');
            const isClickable = e.target.classList.contains('clickable-image');
            const isCollageImg = e.target.closest('.collage-grid') && e.target.tagName === 'IMG';

            if (isQuickView || isClickable || isCollageImg) {
                if (imgModal && modalImg) {
                    // Si es el botón 'Vista Rápida', buscamos la imagen dentro de la tarjeta del producto
                    const src = (isQuickView) 
                        ? e.target.closest('.product-card').querySelector('img').src 
                        : e.target.src;

                    modalImg.src = src;
                    imgModal.style.display = "flex"; 
                    setTimeout(() => imgModal.classList.add('show'), 20);
                }
            }

            // DETECTAR CIERRE: Clic en la "X" (clase close-modal) o en el fondo oscuro
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

    // 7. LÓGICA ACORDEÓN DE MARCAS
    safeExecute(() => {
        const brandToggles = document.querySelectorAll('.brand-toggle');
        brandToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const item = toggle.parentElement;
                document.querySelectorAll('.brand-item').forEach(i => {
                    if (i !== item) i.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    });
});