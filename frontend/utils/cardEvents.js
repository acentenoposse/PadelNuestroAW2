import {
  agregarProducto,
  restarProducto,
  getCantidadProducto,
  getCantidadTotalItems
} from './carritoStorage.js';

// Lógica compartida de las tarjetas: clicks de agregar/sumar/restar,
// actualización de los contadores y del badge del carrito en la navbar.

export function actualizarBadgeCarrito() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const total = getCantidadTotalItems();
  badge.textContent = total;
  badge.hidden = total === 0;
}

function actualizarContador(id) {
  const cantidad = getCantidadProducto(id);
  document
    .querySelectorAll(`.cantidad-carrito[data-id="${id}"]`)
    .forEach((span) => {
      span.textContent = cantidad;
    });
}

export function inicializarContadores(contenedor) {
  if (!contenedor) return;
  contenedor.querySelectorAll('.cantidad-carrito').forEach((span) => {
    actualizarContador(span.dataset.id);
  });
  actualizarBadgeCarrito();
}

// Mapa id -> Producto, para poder guardar el item completo en el carrito.
export function configurarEventosCarrito(contenedor, mapaProductos) {
  if (!contenedor) return;

  contenedor.addEventListener('click', (e) => {
    const btnAgregar = e.target.closest('.btn-agregar-carrito');
    const btnSumar = e.target.closest('.btn-sumar-carrito');
    const btnRestar = e.target.closest('.btn-restar-carrito');

    const objetivo = btnAgregar || btnSumar || btnRestar;
    if (!objetivo) return;

    const id = Number(objetivo.dataset.id);

    if (btnRestar) {
      restarProducto(id);
    } else {
      const producto = mapaProductos.get(id);
      if (!producto || !producto.disponible) return;
      agregarProducto(producto);
    }

    actualizarContador(id);
    actualizarBadgeCarrito();
  });
}
