// Clase Categoria: representa una categoría/tipo de producto del catálogo.
// Mapea el JSON que devuelve el backend ( { id, nombre } ) a un objeto
// de dominio del frontend.

export class Categoria {
  constructor({ id, nombre }) {
    this.id = Number(id);
    this.nombre = nombre;
  }

  static fromJson(json) {
    return new Categoria(json);
  }

  static listFromJson(lista = []) {
    return lista.map((c) => Categoria.fromJson(c));
  }
}
