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

    // 4. VISTA RÁPIDA UNIVERSAL (REPARADA PARA PRODUCTOS Y COLLAGES)
    safeExecute(() => {
        const imgModal = document.getElementById("imageModal");
        const modalImg = document.getElementById("img01");

        // Carrusel
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
            const isQuickView = e.target.classList.contains('quick-view');
            const isClickable = e.target.classList.contains('clickable-image');
            const isCollageImg = e.target.closest('.collage-grid') && e.target.tagName === 'IMG';

            if (isQuickView || isClickable || isCollageImg) {
                if (imgModal && modalImg) {
                    const src = (isQuickView) 
                        ? e.target.closest('.product-card').querySelector('img').src 
                        : e.target.src;

                    modalImg.src = src;
                    imgModal.style.display = "flex"; 
                    setTimeout(() => imgModal.classList.add('show'), 20);
                }
            }

            if (e.target.classList.contains('close-modal') || e.target === imgModal) {
                if (imgModal) {
                    imgModal.classList.remove('show');
                    setTimeout(() => { imgModal.style.display = "none"; }, 300);
                }
            }
        });
    });

    // 5. ANIMACIONES REVEAL SCROLL
    window.onscroll = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    };

    // 6. LÓGICA ACORDEÓN DE MARCAS (OPTIMIZADA PARA MÓVILES)
    safeExecute(() => {
        const brandToggles = document.querySelectorAll('.brand-toggle');
        
        brandToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const item = toggle.parentElement;
                
                document.querySelectorAll('.brand-item').forEach(i => {
                    if (i !== item) {
                        i.classList.remove('active');
                    }
                });
                
                item.classList.toggle('active');
                
                if(item.classList.contains('active')) {
                    setTimeout(() => {
                        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                }
            });
        });
    });

    // 7. CONTROL DEL CARRUSEL (AUTOMÁTICO + MANUAL)
    safeExecute(() => {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        
        if (slides.length === 0) return;

        let current = 0;
        let timer;

        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
            current = index;
            resetTimer();
        };

        const nextSlide = () => {
            let next = (current + 1) % slides.length;
            showSlide(next);
        };

        const prevSlide = () => {
            let prev = (current - 1 + slides.length) % slides.length;
            showSlide(prev);
        };

        const resetTimer = () => {
            clearInterval(timer);
            timer = setInterval(nextSlide, 5000);
        };

        if (nextBtn) nextBtn.onclick = () => nextSlide();
        if (prevBtn) prevBtn.onclick = () => prevSlide();

        resetTimer();
    });

    // Inicializar visualización del carrito al cargar
    actualizarInterfazCarrito();
});

// --- LÓGICA DE LA CANASTA NC WEST COAST ---

// 1. Inicialización
let carrito = JSON.parse(localStorage.getItem('nc_cart')) || [];

// 2. Función para agregar productos con animación
function agregarAlCarrito(nombre, precio, imagen) {
    const precioNumerico = precio.replace(/[^0-9.]/g, "");
    
    // Buscamos si el producto ya existe en la canasta
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        // Si ya existe, solo aumentamos la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si es nuevo, lo agregamos con cantidad 1
        const nuevoProducto = { 
            nombre: nombre, 
            precio: precioNumerico, 
            imagen: imagen, 
            id: Date.now(),
            cantidad: 1 // Nueva propiedad de cantidad
        };
        carrito.push(nuevoProducto);
    }
    
    localStorage.setItem('nc_cart', JSON.stringify(carrito));
    actualizarInterfazCarrito();
    animarIconoCarrito();
}

// 3. Actualizar la vista del carrito y el contador (CON CANTIDADES)
function actualizarInterfazCarrito() {
    const container = document.getElementById('cart-items-container');
    const countLabel = document.getElementById('cart-count');
    const totalLabel = document.getElementById('cart-total');
    
    if(!container) return;

    if (carrito.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #999; padding: 20px;">Tu canasta está vacía</p>`;
        if(countLabel) countLabel.innerText = "0";
        if(totalLabel) totalLabel.innerText = "$0.00";
        return;
    }

    container.innerHTML = "";
    let totalItems = 0;
    let precioTotal = 0;

    carrito.forEach((item, index) => {
        const subtotal = parseFloat(item.precio) * item.cantidad;
        precioTotal += subtotal;
        totalItems += item.cantidad;
        
        container.innerHTML += `
            <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <img src="${item.imagen}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                <div style="flex: 1;">
                    <div style="font-size: 0.9rem; font-weight: 600; color: #333;">${item.nombre}</div>
                    <div style="color: #bfa37e; font-size: 0.85rem;">
                        ${item.cantidad} x $${parseFloat(item.precio).toLocaleString()}
                    </div>
                </div>
                <button onclick="eliminarDelCarrito(${index})" style="background: none; border: none; color: #ff5e5e; cursor: pointer; font-size: 1.1rem; padding: 5px;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    if(countLabel) countLabel.innerText = totalItems;
    if(totalLabel) totalLabel.innerText = `$${precioTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

// 4. Eliminar producto
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('nc_cart', JSON.stringify(carrito));
    actualizarInterfazCarrito();
}

// 5. Mostrar/Ocultar Modal del Carrito
function toggleCartModal() {
    const modal = document.getElementById('modalCarrito');
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
        actualizarInterfazCarrito();
    }
}

// 6. Animación de sacudida (Shake)
function animarIconoCarrito() {
    const icon = document.getElementById('cart-icon');
    if(icon) {
        icon.animate([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: 'translate(-5px, 0) rotate(-10deg)' },
            { transform: 'translate(5px, 0) rotate(10deg)' },
            { transform: 'translate(-5px, 0) rotate(-10deg)' },
            { transform: 'translate(5px, 0) rotate(10deg)' },
            { transform: 'translate(0, 0) rotate(0deg)' }
        ], {
            duration: 500,
            easing: 'ease-in-out'
        });
    }
}

// 7. GENERADOR DE TICKET VISUAL PREMIUM CON REINICIO
async function generarTicketPDF() {
    if (carrito.length === 0) {
        alert("Agrega productos antes de generar el ticket.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const totalTxt = document.getElementById('cart-total').innerText;

    const logoImg = new Image();
    logoImg.src = 'NC.jpg';

    logoImg.onload = async function() {
        // --- DISEÑO DE CABECERA NC ---
        doc.setFillColor(249, 247, 242); 
        doc.rect(0, 0, 210, 50, 'F');
        doc.setDrawColor(191, 163, 126);
        doc.setLineWidth(1);
        doc.line(0, 50, 210, 50);

        doc.addImage(logoImg, 'JPEG', 15, 10, 30, 30);

        doc.setTextColor(191, 163, 126);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("NC WEST COAST", 50, 25);
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("SOLICITUD DE PEDIDO PERSONALIZADO", 50, 32);
        doc.text("ESTILO AMERICANO • DIRECTO A MÉXICO", 50, 37);

        doc.setFontSize(9);
        const folio = "FOLIO: #NC" + Math.floor(1000 + Math.random() * 9000);
        doc.text(new Date().toLocaleDateString(), 195, 20, { align: "right" });
        doc.text(folio, 195, 26, { align: "right" });

        // --- LISTADO DE PRODUCTOS CON IMÁGENES ---
        let y = 65;
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("RESUMEN DE TU SELECCIÓN:", 20, y);
        y += 10;

        for (const item of carrito) {
            if (y > 240) { doc.addPage(); y = 20; }

            doc.setDrawColor(240, 240, 240);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(15, y, 180, 25, 3, 3, 'FD');

            // Imagen del producto
            try {
                const pImg = new Image();
                pImg.src = item.imagen;
                await new Promise((resolve) => {
                    pImg.onload = () => {
                        doc.addImage(pImg, 'JPEG', 20, y + 2, 20, 20); 
                        resolve();
                    };
                    pImg.onerror = () => resolve();
                });
            } catch (e) { console.error(e); }

            // Nombre del producto
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(item.nombre.toUpperCase(), 45, y + 8);
            
            // Cantidad y Precio Unitario
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`CANTIDAD: ${item.cantidad}`, 45, y + 14);
            doc.text(`PRECIO UNIT: $${parseFloat(item.precio).toLocaleString()} MXN`, 45, y + 20);

            // Subtotal por renglón (Derecha)
            const subtotalRenglon = parseFloat(item.precio) * item.cantidad;
            doc.setTextColor(191, 163, 126);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(`$${subtotalRenglon.toLocaleString()} MXN`, 190, y + 14, { align: "right" });

            y += 30;
        }

        if (y > 260) { doc.addPage(); y = 20; }
        
        doc.setFillColor(191, 163, 126);
        doc.rect(120, y, 75, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL: ${totalTxt}`, 125, y + 10);

        doc.setTextColor(150, 150, 150);
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.text("Este ticket es una solicitud de cotización.", 105, 280, { align: "center" });
        doc.text("Envíalo por Messenger para confirmar disponibilidad.", 105, 285, { align: "center" });

        // Guardar PDF
        doc.save(`Ticket_NC_${Math.floor(Date.now()/1000)}.pdf`);
        
        // --- PROCESO DE REINICIO ---
        alert("¡Catálogo generado! Tu canasta se vaciará y te llevaremos al chat.");
        localStorage.removeItem('nc_cart'); 
        window.open("https://m.me/859771300559984", "_blank");
        location.reload(); 
    };
}