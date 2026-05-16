
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
