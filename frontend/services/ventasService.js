import { apiClient } from './apiClient.js';

// Servicio de ventas: genera la orden de compra contra el backend.
// El backend (/ventas POST) espera { usuarioId, items: [{ productoId, cantidad }] }
// y valida usuario, stock y cantidades.

export const ventasService = {
  async crearOrden(usuarioId, itemsCarrito) {
    const items = itemsCarrito.map((item) => ({
      productoId: Number(item.id),
      cantidad: Number(item.cantidad)
    }));

    const data = await apiClient.post('/ventas', {
      usuarioId: Number(usuarioId),
      items
    });

    return data.venta;
  }
};
