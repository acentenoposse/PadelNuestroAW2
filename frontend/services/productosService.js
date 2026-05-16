import { apiClient } from './apiClient.js';
import { Producto } from '../models/Producto.js';

// Servicio de productos: habla con /productos del backend y devuelve
// instancias de la clase Producto (no JSON crudo).

export const productosService = {
  // Listado de TODOS los productos a la venta.
  async listar() {
    const data = await apiClient.get('/productos');
    return Producto.listFromJson(data.productos);
  },

  // Productos filtrados por categoría (el filtro lo resuelve el backend
  // vía query param ?categoriaId=).
  async listarPorCategoria(categoriaId) {
    if (!categoriaId) return this.listar();
    const data = await apiClient.get(
      `/productos?categoriaId=${Number(categoriaId)}`
    );
    return Producto.listFromJson(data.productos);
  },

  // Detalle de un producto.
  async obtener(id) {
    const data = await apiClient.get(`/productos/${Number(id)}`);
    return Producto.fromJson(data.producto);
  }
};
