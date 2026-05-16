import { ASSETS_BASE } from '../config.js';

export class Producto {
  constructor({ id, nombre, descripcion, precio, img, categorias, stockActivo }) {
    this.id = Number(id);
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = Number(precio);
    this.img = img;

    this.categorias = Array.isArray(categorias) ? categorias.map(Number) : [];
    this.stockActivo = Boolean(stockActivo);
  }

  static fromJson(json) {
    return new Producto(json);
  }

  static listFromJson(lista = []) {
    return lista.map((p) => Producto.fromJson(p));
  }

  get imagenUrl() {
    if (!this.img) return `${ASSETS_BASE}/logo.png`;
    if (this.img.startsWith('http') || this.img.startsWith('/')) return this.img;
    return `${ASSETS_BASE}/${this.img}`;
  }


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
