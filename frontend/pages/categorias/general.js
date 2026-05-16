import { cardComponent } from '../../components/card.js';
import { productosService } from '../../services/productosService.js';
import {
  configurarEventosCarrito,
  inicializarContadores
} from '../../utils/cardEvents.js';

// Página de categoría genérica. La categoría se define en el HTML con
// el atributo data-categoria-id en #cardContainer. El filtro por
// categoría lo resuelve el backend (?categoriaId=).

const cardContainer = document.getElementById('cardContainer');
const buscador = document.getElementById('buscador');
const estado = document.getElementById('estado');

const mapaProductos = new Map();
let productosCategoria = [];

function render(lista) {
  if (lista.length === 0) {
    cardContainer.innerHTML = '';
    estado.hidden = false;
    estado.textContent = 'No hay productos disponibles en esta categoría.';
    return;
  }
  estado.hidden = true;
  cardContainer.innerHTML = lista.map(cardComponent).join('');
  inicializarContadores(cardContainer);
}

async function init() {
  const categoriaId = Number(cardContainer.dataset.categoriaId);

  try {
    productosCategoria = await productosService.listarPorCategoria(categoriaId);
    productosCategoria.forEach((p) => mapaProductos.set(p.id, p));

    render(productosCategoria);
    configurarEventosCarrito(cardContainer, mapaProductos);

    if (buscador) {
      buscador.addEventListener('input', (e) => {
        const t = e.target.value.trim().toLowerCase();
        if (!t) return render(productosCategoria);
        render(
          productosCategoria.filter(
            (p) =>
              p.nombre.toLowerCase().includes(t) ||
              p.descripcion.toLowerCase().includes(t)
          )
        );
      });
    }
  } catch (error) {
    estado.hidden = false;
    estado.className = 'estado-error';
    estado.textContent = `No se pudieron cargar los productos: ${error.message}`;
  }
}

window.addEventListener('load', init);
