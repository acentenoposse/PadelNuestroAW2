// Componente de filtro por categoría / tipo de producto.
// Renderiza "chips" clickeables a partir de las categorías del backend.
// La categoría activa se marca con la clase .activo.

export const filtroCategoriasComponent = (categorias, categoriaActivaId = null) => {
  const chip = (id, nombre) => {
    const activo =
      String(id) === String(categoriaActivaId) ? ' activo' : '';
    return `<button class="chip-categoria${activo}" data-categoria="${id}">${nombre}</button>`;
  };

  const todas = `<button class="chip-categoria${
    !categoriaActivaId ? ' activo' : ''
  }" data-categoria="">Todos</button>`;

  return `
    <div class="filtro-categorias" role="group" aria-label="Filtrar por categoría">
        ${todas}
        ${categorias.map((c) => chip(c.id, c.nombre)).join('')}
    </div>
  `;
};
