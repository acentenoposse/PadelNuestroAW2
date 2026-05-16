// Componente de tarjeta de producto.
// Recibe una instancia de la clase Producto.

export const cardComponent = (producto) => {
  const nombreMayus = producto.nombre.toUpperCase();
  const sinStock = !producto.disponible;

  return `
        <div class="card-producto" data-id="${producto.id}">
            <div class="card-img">
                <img src="${producto.imagenUrl}" alt="${nombreMayus}" loading="lazy">
                ${sinStock ? '<span class="badge-sin-stock">Sin stock</span>' : ''}
            </div>

            <div class="card-info">
                <h1>${nombreMayus}</h1>
                <h3>${producto.descripcion}</h3>
                <h2>${producto.precioFormateado}</h2>

                <div class="botonescarro">
                    <img src="/assets/remove.svg" alt="Restar" height="30" width="30"
                        class="btn-restar-carrito" data-id="${producto.id}">
                    <button
                        class="btn-agregar-carrito"
                        data-id="${producto.id}"
                        ${sinStock ? 'disabled' : ''}
                    >${sinStock ? 'No disponible' : 'Agregar'}</button>
                    <img src="/assets/add.svg" alt="Sumar" height="30" width="30"
                        class="btn-sumar-carrito" data-id="${producto.id}">
                </div>

                <div class="contador-carrito">
                    <span>Cantidad:</span>
                    <span class="cantidad-carrito" data-id="${producto.id}">0</span>
                </div>
            </div>
        </div>
    `;
};
