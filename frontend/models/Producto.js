import { ASSETS_BASE } from '../config.js';

// Clase Producto: adapta el JSON del backend
// ( { id, nombre, descripcion, precio, img, categorias[], stockActivo } )
// a un objeto de dominio del frontend con helpers de presentación.

export class Producto {
  constructor({ id, nombre, descripcion, precio, img, categorias, stockActivo }) {
    this.id = Number(id);
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = Number(precio);
    this.img = img;
    // ids de categoría a las que pertenece el producto
    this.categorias = Array.isArray(categorias) ? categorias.map(Number) : [];
    this.stockActivo = Boolean(stockActivo);
  }

  static fromJson(json) {
    return new Producto(json);
  }

  static listFromJson(lista = []) {
    return lista.map((p) => Producto.fromJson(p));
  }

  // URL completa de la imagen (las imágenes son assets del frontend).
  get imagenUrl() {
    if (!this.img) return `${ASSETS_BASE}/logo.png`;
    if (this.img.startsWith('http') || this.img.startsWith('/')) return this.img;
    return `${ASSETS_BASE}/${this.img}`;
  }

  // Precio formateado en pesos argentinos.
  get precioFormateado() {
    return this.precio.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    });
  }

  get disponible() {
    return this.stockActivo;
  }

  perteneceA(categoriaId) {
    return this.categorias.includes(Number(categoriaId));
  }

  // Representación liviana para guardar en el carrito (localStorage).
  toItemCarrito(cantidad = 1) {
    return {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio,
      img: this.img,
      cantidad
    };
  }
}
