import {
  getCarrito,
  agregarProducto,
  restarProducto,
  eliminarProducto,
  vaciarCarrito,
  getTotalCarrito
} from '../../utils/carritoStorage.js';
import { authService } from '../../services/authService.js';
import { ventasService } from '../../services/ventasService.js';
import { actualizarBadgeCarrito } from '../../utils/cardEvents.js';
import { formatearPrecio } from '../../utils/format.js';

const tbody = document.getElementById('tbody-carrito');
const totalCarrito = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('btn-vaciar');
const btnComprar = document.getElementById('btn-comprar');
const infoUsuario = document.getElementById('info-usuario');
const mensajeCompra = document.getElementById('mensaje-compra');

function cargarUsuario() {
  const usuario = authService.getUsuario();
  if (usuario) {
    infoUsuario.textContent = `Estás comprando como: ${usuario.nombre} (${usuario.email})`;
  } else {
    infoUsuario.innerHTML =
      'No hay usuario logueado. <a href="/pages/formularios/login.html">Iniciá sesión</a> para poder comprar.';
  }
}

function mostrarMensaje(texto, tipo) {
  mensajeCompra.hidden = false;
  mensajeCompra.textContent = texto;
  mensajeCompra.className = `mensaje-compra ${tipo}`;
}

function renderCarrito() {
  const carrito = getCarrito();

  if (carrito.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5">No tenés productos en el carrito.</td></tr>';
    totalCarrito.textContent = '';
    btnComprar.disabled = true;
    return;
  }

  btnComprar.disabled = false;

  tbody.innerHTML = carrito
    .map((p) => {
      const subtotal = p.precio * p.cantidad;
      return `
        <tr>
            <td>${p.nombre}</td>
            <td>${formatearPrecio(p.precio)}</td>
            <td>${p.cantidad}</td>
            <td>${formatearPrecio(subtotal)}</td>
            <td>
                <button class="btn-restar" data-id="${p.id}">-</button>
                <button class="btn-sumar" data-id="${p.id}">+</button>
                <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
            </td>
        </tr>`;
    })
    .join('');

  totalCarrito.textContent = `Total: ${formatearPrecio(getTotalCarrito())}`;
}

tbody.addEventListener('click', (e) => {
  const boton = e.target.closest('button');
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (!id) return;

  if (boton.classList.contains('btn-sumar')) {
    // Reusa el item existente del carrito para sumar 1
    const item = getCarrito().find((p) => Number(p.id) === id);
    if (item) agregarProducto(item);
  } else if (boton.classList.contains('btn-restar')) {
    restarProducto(id);
  } else if (boton.classList.contains('btn-eliminar')) {
    eliminarProducto(id);
  }

  renderCarrito();
  actualizarBadgeCarrito();
});

btnVaciar.addEventListener('click', () => {
  if (confirm('¿Seguro que querés vaciar el carrito?')) {
    vaciarCarrito();
    renderCarrito();
    actualizarBadgeCarrito();
    mensajeCompra.hidden = true;
  }
});

btnComprar.addEventListener('click', async () => {
  const usuario = authService.getUsuario();

  if (!usuario) {
    mostrarMensaje(
      'Tenés que iniciar sesión para finalizar la compra.',
      'error'
    );
    return;
  }

  const carrito = getCarrito();
  if (carrito.length === 0) {
    mostrarMensaje('El carrito está vacío.', 'error');
    return;
  }

  btnComprar.disabled = true;
  btnComprar.textContent = 'Procesando...';

  try {
    const venta = await ventasService.crearOrden(usuario.id, carrito);

    mostrarMensaje(
      `¡Compra realizada! Orden #${venta.id} por ${formatearPrecio(
        venta.total
      )}. ¡Gracias por tu compra!`,
      'exito'
    );

    vaciarCarrito();
    renderCarrito();
    actualizarBadgeCarrito();
  } catch (error) {
    mostrarMensaje(
      `No se pudo generar la orden: ${error.message}`,
      'error'
    );
  } finally {
    btnComprar.textContent = 'Finalizar compra';
    btnComprar.disabled = getCarrito().length === 0;
  }
});

cargarUsuario();
renderCarrito();
