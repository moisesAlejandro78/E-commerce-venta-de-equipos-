// assets/js/script.js
document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll('.btn-carrito');
    const carritoItems = document.getElementById('carrito-items');
    const contadorItems = document.getElementById('contador-items');
    const carritoTotal = document.getElementById('carrito-total');
    const vaciarCarrito = document.getElementById('vaciar-carrito');

    // Cargar carrito desde localStorage
    let itemsEnCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Formatear precio en bolivianos
    function formatearPrecio(precio) {
        return parseFloat(precio).toLocaleString('es-BO', { minimumFractionDigits: 2 }) + ' bs.';
    }

    // Guardar en localStorage
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(itemsEnCarrito));
    }

    // Actualizar visualmente el carrito
    function actualizarCarrito() {
        contadorItems.textContent = itemsEnCarrito.length;

        const total = itemsEnCarrito.reduce((sum, item) => sum + parseFloat(item.precio), 0);
        carritoTotal.innerHTML = `Total: <strong>${formatearPrecio(total)}</strong>`;

        carritoItems.innerHTML = '';
        itemsEnCarrito.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <div>
                    <div style="font-weight:600; font-size:0.95rem;">${item.nombre}</div>
                    <small style="color:#ff8c00;">${formatearPrecio(item.precio)}</small>
                </div>
                <button class="btn-quitar-item" data-index="${index}">✕</button>
            `;
            carritoItems.appendChild(div);
        });

        // Eventos para botones "quitar"
        document.querySelectorAll('.btn-quitar-item').forEach(btn => {
            btn.onclick = function () {
                quitarDelCarrito(parseInt(this.dataset.index));
            };
        });

        // Actualizar estado de los botones "Agregar/Quitar"
        botones.forEach(btn => {
            const nombre = btn.dataset.nombre;
            const estaEnCarrito = itemsEnCarrito.some(item => item.nombre === nombre);
            if (estaEnCarrito) {
                btn.classList.add('agregado');
                btn.textContent = 'Quitar del Carrito';
            } else {
                btn.classList.remove('agregado');
                btn.textContent = 'Agregar al Carrito';
            }
        });
    }

    // Quitar un producto
    function quitarDelCarrito(index) {
        itemsEnCarrito.splice(index, 1);
        guardarCarrito();
        actualizarCarrito();
    }

    // Vaciar todo
    vaciarCarrito.addEventListener('click', () => {
        if (confirm('¿Vaciar todo el carrito?')) {
            itemsEnCarrito = [];
            guardarCarrito();
            actualizarCarrito();
        }
    });

    // Eventos de los botones "Agregar al Carrito"
    botones.forEach(btn => {
        btn.addEventListener('click', function () {
            const nombre = this.dataset.nombre;
            const precio = this.dataset.precio;

            const yaEsta = itemsEnCarrito.some(item => item.nombre === nombre);

            if (yaEsta) {
                // QUITAR
                itemsEnCarrito = itemsEnCarrito.filter(item => item.nombre !== nombre);
            } else {
                // AGREGAR
                itemsEnCarrito.push({ nombre, precio });
            }

            guardarCarrito();
            actualizarCarrito();
        });
    });

    // Inicializar
    actualizarCarrito();
});