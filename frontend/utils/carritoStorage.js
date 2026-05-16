const CLAVE_CARRITO = 'carritoCompra';

export function getCarrito() {
  const data = localStorage.getItem(CLAVE_CARRITO);
  return data ? JSON.parse(data) : [];
}

function saveCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

export function agregarProducto(producto) {
  const carrito = getCarrito();
  const id = Number(producto.id);
  const index = carrito.findIndex((p) => Number(p.id) === id);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({
      id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      img: producto.img,
      cantidad: 1
    });
  }

  saveCarrito(carrito);
}

export function restarProducto(idProducto) {
  const carrito = getCarrito();
  const id = Number(idProducto);
  const index = carrito.findIndex((p) => Number(p.id) === id);

  if (index === -1) return;

  carrito[index].cantidad -= 1;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  saveCarrito(carrito);
}

export function eliminarProducto(idProducto) {
  const id = Number(idProducto);
  const carrito = getCarrito().filter((p) => Number(p.id) !== id);
  saveCarrito(carrito);
}

export function vaciarCarrito() {
  saveCarrito([]);
}

export function getCantidadProducto(idProducto) {
  const id = Number(idProducto);
  const item = getCarrito().find((p) => Number(p.id) === id);
  return item ? item.cantidad : 0;
}

export function getTotalCarrito() {
  return getCarrito().reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}

export function getCantidadTotalItems() {
  return getCarrito().reduce((acc, p) => acc + p.cantidad, 0);
}
